from fastapi import FastAPI, HTTPException, Query
from contextlib import asynccontextmanager
from fake_useragent import UserAgent
from dotenv import load_dotenv
from prisma import Prisma
from request_handler import get_country_data, make_request


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manages startup and shutdown database connection."""
    db.connect()
    yield
    db.disconnect()

app = FastAPI(lifespan=lifespan)
ua = UserAgent()
load_dotenv()
db = Prisma()

@app.get("/find_creators")
async def find_creators(
    country: str = Query("US", description="Country code"), 
    page: int = Query(1, description="Page number")
):

    url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find"
    body = {"query": "", "pagination": {"size": 12, "page": page}, "filter_params": {}}
    country_record = await get_country_data(country, db)
    params = {"user_language": country_record.user_language, "shop_region": country}
    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")
    
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

    url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/cmp/creator/rank/list/get"
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
    country: str = Query(..., description="Country code (US, UK, ES, MX)"),
    creator_id: str = Query(..., description="Creator ID"),
    profile_type: int = Query(..., description="Enter page numer (range 1 - 5)")
):
    url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/profile"
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



