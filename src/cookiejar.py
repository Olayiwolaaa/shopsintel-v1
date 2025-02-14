import time, os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--user-data-dir=/Users/muizzkaraole/Library/Application Support/Google/Chrome_Selenium")
chrome_options.add_argument("--profile-directory=Default")

# Automatically install and use ChromeDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
wait = WebDriverWait(driver, 10)

# Dictionary of country codes and their corresponding URLs
COUNTRY_URLS = {
    "US": "https://partner.us.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=US",
    "GB": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=GB",
    "ES": "https://partner.eu.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=ES",
    "MX": "https://partner.tiktokshop.com/v2_sandbox/config?activeTab=test_function&region=MX",
}

# Ensure cookies directory exists
os.makedirs("cookies", exist_ok=True)

try:
    for country, url in COUNTRY_URLS.items():
        print(f"\nProcessing {country}...")

        # Open TikTok Shop Partner page
        driver.get(url)
        print(f"Clicked 'Go to seller center' for {country}. Waiting for 5 seconds...")
        time.sleep(5)

        # Click the "Go to seller center" button
        try:
            # go_to_seller_center_button = driver.find_element(By.CSS_SELECTOR, ".head-module__buttonBox--eYzyk > button")
            # go_to_seller_center_button = driver.find_element(By.XPATH, "//button[contains(span, 'Go to Seller Centre')]")
            go_to_seller_center_button = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="arco-tabs-0-panel-1"]//button')))

            
            ActionChains(driver).move_to_element(go_to_seller_center_button).click().perform()
            print(f"Clicked 'Go to seller center' for {country}. Waiting for 15 seconds...")
            time.sleep(15)

        # Go to Affiliate Center
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
            print(f"Error redirecting to Affiliate Center for {country}: {e}")

        # Get cookies
        cookies = driver.get_cookies()
        cookie_string = "; ".join([f"{cookie['name']}={cookie['value']}" for cookie in cookies])
        
        db.country.update(
            where={"name": country},
            data={"cookies": cookie_string},
        )


finally:
    driver.quit()
    print("Selenium driver closed.")

