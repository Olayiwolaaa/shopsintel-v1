import os
import time
import psycopg2
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv
import os

load_dotenv()

# PostgreSQL connection function
def get_db_connection():
    return psycopg2.connect(
        dbname = os.getenv("DATABASE_NAME"),
        user = os.getenv("DATABASE_USER"),
        password = os.getenv("DATABASE_PASSWORD"),
        host = os.getenv("DATABASE_HOST"),
        port = os.getenv("DATABASE_PORT")
    )

# Function to update cookies in PostgreSQL
def update_cookie_column(country_name, cookie_value):
    """Update the cookie column in the Country table."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('UPDATE "Country" SET cookies = %s WHERE name = %s', (cookie_value, country_name))
            conn.commit()
            print(f"✅ Updated cookie for {country_name} in PostgreSQL.")
    except Exception as e:
        print(f"❌ Database update error for {country_name}: {e}")
    finally:
        conn.close()

# Function to fetch cookies using Selenium
def fetch_cookies(country: str):
    """Fetch TikTok Shop cookies for a given country and update PostgreSQL."""
    COUNTRY_URLS = {
    #     "US": "https://partner.us.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=US",
    #     "GB": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=GB",
        "MX": "https://partner.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=MX",
        "ES": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=ES",
    }

    if country not in COUNTRY_URLS:
        print(f"❌ Invalid country: {country}")
        return

    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--headless")  # Uncomment for headless mode
    chrome_options.add_argument("--user-data-dir=/Users/muizzkaraole/Library/Application Support/Google/Chrome_Selenium")
    
    # Handle US and GB separately from MX and ES
    if country in ["US", "GB"]:
        chrome_options.add_argument("--profile-directory=Default")
    else:
        chrome_options.add_argument("--profile-directory=Profile 1")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 10)

    try:
        url = COUNTRY_URLS[country]
        print(f"\n🌍 Processing {country}...")
        driver.get(url)
        time.sleep(5)  # Allow page to load

        # Click the "Go to seller center" button
        try:
            go_to_seller_center_button = wait.until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="arco-tabs-0-panel-1"]//button/span'))
            )
            ActionChains(driver).move_to_element(go_to_seller_center_button).click().perform()
            print(f"✅ Clicked 'Go to seller center' for {country}. Waiting for 20 seconds...")
            time.sleep(20)

            # Redirect to affiliate center
            if country == "US":
                url = "https://affiliate.tiktokglobalshop.com/connection/creator?source_from=seller_affiliate_landing&shop_region=US"
            elif country == "ID":
                url = "https://affiliate-id.tokopedia.com/connection/creator?shop_region=ID"
            else:
                url = f"https://affiliate.tiktok.com/connection/creator?shop_region={country}"

            driver.get(url)
            print(f"🔄 Redirected to Affiliate Center for {country}. Waiting for 5 seconds...")
            time.sleep(5)

        except Exception as e:
            print(f"❌ Error clicking button for {country}: {e}")

        # Get cookies
        cookies = driver.get_cookies()
        cookie_string = "; ".join([f"{cookie['name']}={cookie['value']}" for cookie in cookies])

        # Update database
        update_cookie_column(country, cookie_string)

    finally:
        driver.quit()
        print("🚀 Selenium driver closed.")

# Run the script for US and GB separately, then MX and ES separately
def main():
    us_gb_countries = ["US", "GB"]
    mx_es_countries = ["MX", "ES"]

    # Process US and GB countries
    for country in us_gb_countries:
        fetch_cookies(country)

    # Process MX and ES countries
    for country in mx_es_countries:
        fetch_cookies(country)

# Execute the script
if __name__ == "__main__":
    main()
