# Selenium Test Cases for Blog Application

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Install ChromeDriver:
   - Download from: https://chromedriver.chromium.org/
   - Add to system PATH

## Running Tests

### Run all tests:
```bash
pytest test_blog_app.py -v
```

### Run with HTML report:
```bash
pytest test_blog_app.py -v --html=report.html --self-contained-html
```

### Run specific test:
```bash
pytest test_blog_app.py::TestBlogApp::test_homepage_loads -v
```

## Test Cases

1. **test_homepage_loads** - Verify homepage loads successfully
2. **test_navigate_to_signup** - Test navigation to signup page
3. **test_signup_empty_fields** - Validate signup form with empty fields
4. **test_signup_valid_credentials** - Test successful signup
5. **test_navigate_to_login** - Test navigation to login page
6. **test_login_invalid_credentials** - Test login rejection with invalid credentials
7. **test_login_valid_credentials** - Test successful login
8. **test_access_blogs_page** - Verify blogs page is accessible
9. **test_access_discover_page** - Verify discover page is accessible
10. **test_access_about_page** - Verify about page is accessible

## Configuration

Update `BASE_URL` in `test_blog_app.py` to match your application URL:
- Local: `http://localhost:3000`
- EC2: `http://your-ec2-ip:3000`

## Docker Integration

For Jenkins pipeline, use with Docker:
```bash
docker run --network=host selenium/standalone-chrome pytest test_blog_app.py
```
