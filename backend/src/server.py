from typing import Optional
from request_handler import fetch_cookies, get_country_data, make_request
from fastapi import BackgroundTasks, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fake_useragent import UserAgent
from dotenv import load_dotenv
from prisma import Prisma
import os


db = Prisma()
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages startup and shutdown database connection."""
    db.connect()
    yield
    db.disconnect()

app = FastAPI(lifespan=lifespan)
ua = UserAgent()
PORT = int(os.getenv("PORT", 8000))  # Default to 8000 if PORT is not set

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/find_creators")
async def find_creators(
    country: str = Query("US", description="Country code"), 
    page: int = Query(1, description="Page number"),
    filter_by: Optional[str] = Query("relevance", description="Filter creators by a specific metric"),
    search_query: Optional[str] = Query(None, description="Search query for creators")  # 🔹 Added search
):
    if country == "US":
        url = "https://affiliate.tiktokglobalshop.com/api/v1/oec/affiliate/creator/marketplace/find"
    elif country == "ID":
        url = "https://affiliate-id.tokopedia.com/api/v1/oec/affiliate/creator/marketplace/find"
    else:
        url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find"

    set_algorithm_to_filter_by = {
        "relevance": 1,
        "GMV": 18,
        "Item Sold": 20,
        "Followers": 26,
        "Avg. video views": 24,
        "Engagement Rate": None,  # Exclude "algorithm" if this is used
    }

    # Ensure valid filter selection
    if filter_by not in set_algorithm_to_filter_by:
        raise HTTPException(status_code=400, detail="Invalid filter option")

    # Prepare request body
    body = {
        "pagination": {"size": 12, "page": page},
        "filter_params": {},
    }

    # 🔹 Add "query" only if search_query is provided
    if search_query:
        body["query"] = search_query
        body["query_type"] = 3  # Needed for searching

    # Add algorithm parameter only if it's not None
    algorithm = set_algorithm_to_filter_by[filter_by]
    if algorithm is not None:
        body["algorithm"] = algorithm

    country_record = await get_country_data(country, db)
    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")

    params = {"user_language": country_record.user_language, "shop_region": country}

    headers = {
        "User-Agent": ua.random,
        "cookie": country_record.cookies
    }

    return await make_request(url, params, body, headers)



@app.get("/view_rankings")
async def view_rankings(
    country: str = Query("US", description="Country code"), 
    page: int = Query(1, description="Page number")
):
    
    if country == "US":
        url = "https://affiliate.tiktokglobalshop.com/api/v1/oec/affiliate/cmp/creator/rank/list/get"
    elif country == "ID":
        url = "https://affiliate-id.tokopedia.com/api/v1/oec/affiliate/cmp/creator/rank/list/get"
    else:
        url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/cmp/creator/rank/list/get"

    # url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/cmp/creator/rank/list/get"
    body = {"rank_list_meta":{"rank_type":1,"rank_period":1,"rank_date":"2025-02-09","indus_cate":"All","content_type":1},"size":20,"page": page}
    country_record = await get_country_data(country, db)
    params = {"user_language": country_record.user_language, "shop_region": country}
    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")
    
    headers = {
        "User-Agent": ua.random,
        "cookie": country_record.cookies
    }
    
    return await make_request(url, params, body, headers)

@app.get("/creator_profile")
async def creator_profile(
    country: str = Query(..., description="Country code (US, GB, ES, MX)"),
    creator_id: str = Query(..., description="Creator ID"),
    profile_type: int = Query(..., description="Enter page number (range 1 - 5)")
):
    if country == "US":
        url = "https://affiliate.tiktokglobalshop.com/api/v1/oec/affiliate/creator/marketplace/profile"
    elif country == "ID":
        url = "https://affiliate-id.tokopedia.com/api/v1/oec/affiliate/creator/marketplace/profile"
    else:
        url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/profile"

    # url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/profile"
    body = {"creator_oec_id": creator_id, "profile_types": [profile_type]}
    country_record = await get_country_data(country, db)
    params = {"user_language": country_record.user_language, "shop_region": country}
    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")
    
    headers = {
        "User-Agent": ua.random,
        "cookie": country_record.cookies
    }

    return await make_request(url, params, body, headers)

@app.get("/shoppable_videos")
async def shoppable_videos(
    country: str = Query(..., description="Country code (US, GB, ES, MX)"),
    scene_type: int = Query(2, description="2 for Top Sales, 3 for Most Views"),
    page: int = Query(1, description="Page number starting from 1")
):
    cursor = (page - 1) * 15
    if country == "US":
        # url = "https://seller.us.tiktokglobalshop.com/api/v1/seller/video_center/benchmark_account/list" #1
        url = "https://seller.us.tiktokglobalshop.com/api/v1/seller/livecenter/video_feed/list" #2
    elif country == "ID":
        # url = "https://seller-id.tokopedia.com/api/v1/seller/video_center/benchmark_account/list" #1
        url = "https://seller-id.tokopedia.com/api/v1/seller/livecenter/video_feed/list" #2
    else:
        # url = "https://seller-uk.tiktok.com/api/v1/seller/video_center/benchmark_account/list" #1
        url = "https://seller-uk.tiktok.com/api/v1/seller/livecenter/video_feed/list" #2

    # body = {"filter_category_list":[],"page":{"cursor":cursor,"count":10}} #1
    # url = "https://seller-uk.tiktok.com/api/v1/seller/livecenter/video_feed/list" #2
    body = {"recommend": {"scene_type": scene_type}, "page": {"cursor": cursor, "count": 15}} #2
    country_record = await get_country_data(country, db)
    params = {"locale": country_record.user_language}
    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")
    
    headers = {
        "User-Agent": ua.random,
        "cookie": country_record.cookies
    }

    return await make_request(url, params, body, headers)

@app.post("/fetch-cookies/{country}")
async def trigger_fetch_cookies(country: str, background_tasks: BackgroundTasks):
    """
    Trigger the Selenium cookie fetcher for a specific country.
    Runs in the background.
    """
    country_data = await get_country_data(country, db)
    if not country_data:
        raise HTTPException(status_code=400, detail="Country not found.")

    # Run Selenium in background
    background_tasks.add_task(fetch_cookies, country, db)
    
    return {"message": f"Successfully fetched cookie for {country}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)