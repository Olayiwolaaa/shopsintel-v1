from fastapi import HTTPException
import httpx
import time, os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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


# Function to fetch cookies using Selenium (Runs in background)
async def fetch_cookies(country: str, db):
    """Use Selenium to fetch TikTok Shop cookies for a given country and update DB."""

    COUNTRY_URLS = {
        "US": "https://partner.us.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=US",
        "GB": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=GB",
        "ES": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=ES",
        "MX": "https://partner.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=MX",
    }

    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--headless")  # Run without opening a browser
    chrome_options.add_argument("--user-data-dir=/Users/muizzkaraole/Library/Application Support/Google/Chrome_Selenium")
    chrome_options.add_argument("--profile-directory=Default")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 10)

    try:
        url = COUNTRY_URLS.get(country)
        if not url:
            print(f"Invalid country: {country}")
            return

        print(f"\nProcessing {country}...")
        driver.get(url)
        time.sleep(5)  # Allow page to load

        # Click the "Go to seller center" button
        try:
            go_to_seller_center_button = wait.until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="arco-tabs-0-panel-1"]//button/span'))
            )
            ActionChains(driver).move_to_element(go_to_seller_center_button).click().perform()
            print(f"Clicked 'Go to seller center' for {country}. Waiting for 15 seconds...")
            time.sleep(15)

            if country == "US":
                url = "https://affiliate.tiktokglobalshop.com/connection/creator?source_from=seller_affiliate_landing&shop_region=US"
            elif country == "ID":
                url = "https://affiliate-id.tokopedia.com/connection/creator?shop_region=ID"
            else:
                url = f"https://affiliate.tiktok.com/connection/creator?shop_region={country}"

            driver.get(url)
            print(f"Redirected to Affiliate Center for {country}. Waiting for 5 seconds...")
            time.sleep(5)

        except Exception as e:
            print(f"Error clicking button for {country}: {e}")

        # Get cookies
        cookies = driver.get_cookies()
        cookie_string = "; ".join([f"{cookie['name']}={cookie['value']}" for cookie in cookies])

        # Update database
        db.country.update(where={"name": country}, data={"cookies": cookie_string})

    finally:
        driver.quit()
        print("Selenium driver closed.")