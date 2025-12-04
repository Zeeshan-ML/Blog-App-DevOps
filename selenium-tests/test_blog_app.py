import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

# Base URL of your application (update this)
BASE_URL = "http://localhost:3000"

@pytest.fixture
def driver():
    """Setup headless Chrome driver"""
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


class TestBlogApp:
    """Test cases for Blog Application"""
    
    # Test 1: Homepage loads successfully
    def test_homepage_loads(self, driver):
        """Test if homepage loads without errors"""
        driver.get(BASE_URL)
        assert "Blog" in driver.title or "Home" in driver.page_source
        print("✓ Test 1 Passed: Homepage loads successfully")
    
    # Test 2: Navigation to signup page
    def test_navigate_to_signup(self, driver):
        """Test navigation to signup page"""
        driver.get(BASE_URL)
        signup_link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.LINK_TEXT, "Sign Up"))
        )
        signup_link.click()
        time.sleep(1)
        assert "/signup" in driver.current_url
        print("✓ Test 2 Passed: Navigation to signup page works")
    
    # Test 3: Signup form validation - empty fields
    def test_signup_empty_fields(self, driver):
        """Test signup form validation with empty fields"""
        driver.get(f"{BASE_URL}/signup")
        
        # Find and click submit button without filling fields
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(1)
        
        # Check if still on signup page (validation prevented submission)
        assert "/signup" in driver.current_url
        print("✓ Test 3 Passed: Signup validation for empty fields works")
    
    # Test 4: Signup with valid credentials
    def test_signup_valid_credentials(self, driver):
        """Test signup with valid credentials"""
        driver.get(f"{BASE_URL}/signup")
        
        # Generate unique email
        timestamp = str(int(time.time()))
        email = f"test{timestamp}@example.com"
        
        # Fill signup form
        driver.find_element(By.NAME, "name").send_keys("Test User")
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").send_keys("password123")
        
        # Submit form
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(2)
        
        # Should redirect away from signup page
        assert "/signup" not in driver.current_url
        print("✓ Test 4 Passed: Signup with valid credentials successful")
    
    # Test 5: Navigation to login page
    def test_navigate_to_login(self, driver):
        """Test navigation to login page"""
        driver.get(BASE_URL)
        login_link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.LINK_TEXT, "Login"))
        )
        login_link.click()
        time.sleep(1)
        assert "/login" in driver.current_url
        print("✓ Test 5 Passed: Navigation to login page works")
    
    # Test 6: Login with invalid credentials
    def test_login_invalid_credentials(self, driver):
        """Test login with invalid credentials"""
        driver.get(f"{BASE_URL}/login")
        
        driver.find_element(By.NAME, "email").send_keys("invalid@example.com")
        driver.find_element(By.NAME, "password").send_keys("wrongpassword")
        
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(2)
        
        # Should show error or stay on login page
        assert "/login" in driver.current_url or "error" in driver.page_source.lower()
        print("✓ Test 6 Passed: Login with invalid credentials rejected")
    
    # Test 7: Login with valid credentials
    def test_login_valid_credentials(self, driver):
        """Test login with valid credentials"""
        # First create a user
        driver.get(f"{BASE_URL}/signup")
        timestamp = str(int(time.time()))
        email = f"logintest{timestamp}@example.com"
        password = "password123"
        
        driver.find_element(By.NAME, "name").send_keys("Login Test User")
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").send_keys(password)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(2)
        
        # Logout if logged in
        try:
            logout_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
            logout_button.click()
            time.sleep(1)
        except:
            pass
        
        # Now login
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").send_keys(password)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(2)
        
        # Should redirect away from login page
        assert "/login" not in driver.current_url
        print("✓ Test 7 Passed: Login with valid credentials successful")
    
    # Test 8: Access blogs page
    def test_access_blogs_page(self, driver):
        """Test accessing the blogs listing page"""
        driver.get(f"{BASE_URL}/blogs")
        time.sleep(1)
        
        # Page should load
        assert "blog" in driver.page_source.lower()
        print("✓ Test 8 Passed: Blogs page accessible")
    
    # Test 9: Access discover page
    def test_access_discover_page(self, driver):
        """Test accessing the discover page"""
        driver.get(f"{BASE_URL}/discover")
        time.sleep(1)
        
        # Page should load
        assert driver.current_url == f"{BASE_URL}/discover"
        print("✓ Test 9 Passed: Discover page accessible")
    
    # Test 10: Access about page
    def test_access_about_page(self, driver):
        """Test accessing the about page"""
        driver.get(f"{BASE_URL}/about")
        time.sleep(1)
        
        # Page should load
        assert driver.current_url == f"{BASE_URL}/about"
        print("✓ Test 10 Passed: About page accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=report.html", "--self-contained-html"])
