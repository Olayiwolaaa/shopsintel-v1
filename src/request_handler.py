from fastapi import HTTPException
import httpx

async def get_country_data(country: str, db):
    """Fetch country details from the database."""
    country_record = db.country.find_unique(where={"name": country})

    if not country_record:
        raise HTTPException(status_code=400, detail="Invalid country code")

    return country_record

async def make_request(url: str, params: dict, body: dict, headers: dict):
    """Send an HTTP request and return the response."""
    async with httpx.AsyncClient() as client:
        response = await client.post(url, params=params, json=body, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()