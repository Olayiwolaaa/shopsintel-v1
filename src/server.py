from fastapi import FastAPI, HTTPException, Query
from fake_useragent import UserAgent
from dotenv import load_dotenv
from prisma import Prisma
import httpx


load_dotenv()
app = FastAPI()
ua = UserAgent()
db = Prisma()

@app.get("/find_creators")
async def find_creators(
    country: str = Query("US", description="Country code"), 
    page: int = Query(1, description="Page number")
):
    try:
        db.connect()

        url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/find"
        body = {"query": "", "pagination": {"size": 12, "page": page}, "filter_params": {}}
        country_record = db.country.find_unique( where={'name': country} )
        params = {"user_language": country_record.user_language, "shop_region": country}
        if not country_record:
            raise HTTPException(status_code=400, detail="Invalid country code")
        
        headers = {
            "User-Agent": ua.random,
            "cookie": country_record.cookies
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params, json=body, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        return response.json()

    finally:
        db.disconnect()


@app.get("/creator_profile")
async def creator_profile(
    country: str = Query(..., description="Country code (US, UK, ES, MX)"),
    creator_id: str = Query(..., description="Creator ID"),
    profile_type: int = Query(..., description="Enter page numer (range 1 - 5)")
):
    try:
        db.connect()

        url = "https://affiliate.tiktok.com/api/v1/oec/affiliate/creator/marketplace/profile"
        body = {"creator_oec_id": creator_id, "profile_types": [profile_type]}
        country_record = db.country.find_unique( where={'name': country} )
        params = {"user_language": country_record.user_language, "shop_region": country}
        if not country_record:
            raise HTTPException(status_code=400, detail="Invalid country code")
        
        headers = {
            "User-Agent": ua.random,
            "cookie": country_record.cookies
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params, json=body, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        return response.json()
    finally:
        db.disconnect()