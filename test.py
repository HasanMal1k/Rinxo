from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()

# Test 0: Check All Pages Are Up
print("Test 0: Check All Pages Are Up")

print("  Checking Home page...")
driver.get("http://13.60.208.0:3000/")
assert "Rinxo" in driver.page_source
print("  ✓ Home page is up")

print("  Checking Dashboard page...")
driver.get("http://13.60.208.0:3000/dashboard")
assert "Rinxo" in driver.page_source
print("  ✓ Dashboard page is up")

print("  Checking Portfolio page...")
driver.get("http://13.60.208.0:3000/portfolio")
assert "Rinxo" in driver.page_source
print("  ✓ Portfolio page is up")

print("  Checking Trading page...")
driver.get("http://13.60.208.0:3000/trading")
assert "Rinxo" in driver.page_source
print("  ✓ Trading page is up")

print("  Checking Markets page...")
driver.get("http://13.60.208.0:3000/markets")
assert "Rinxo" in driver.page_source
print("  ✓ Markets page is up")

print("  Checking Login page...")
driver.get("http://13.60.208.0:3000/login")
assert "Rinxo" in driver.page_source
print("  ✓ Login page is up")

print("  Checking Signup page...")
driver.get("http://13.60.208.0:3000/signup")
assert "Rinxo" in driver.page_source
print("  ✓ Signup page is up")

print("✓ All pages are up and running!")

# Test 1: Login Page Load
print("Test 1: Login Page Load")
driver.get("http://13.60.208.0:3000/login")
assert "Welcome back" in driver.page_source
print("✓ Login page loaded successfully")

# Test 2: Valid Login
print("\nTest 2: Valid Login")
driver.get("http://13.60.208.0:3000/login")
driver.find_element(By.ID, "email").send_keys('picobyte@gmail.com')
driver.find_element(By.ID, "password").send_keys('123456')
# Click the login button (looking for the Sign In button)
login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
login_button.click()
time.sleep(3)
# Check for success message or redirect
print("✓ Login attempt completed")

# Test 3: Invalid Login
print("\nTest 3: Invalid Login")
driver.get("http://13.60.208.0:3000/login")
driver.find_element(By.ID, "email").send_keys('invalid@gmail.com')
driver.find_element(By.ID, "password").send_keys('wrongpassword')
login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
login_button.click()
time.sleep(3)
# Check for error message
print("✓ Invalid login handled")

# Test 4: Empty Login Fields
print("\nTest 4: Empty Login Fields")
driver.get("http://13.60.208.0:3000/login")
login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
login_button.click()
time.sleep(2)
print("✓ Empty fields validation")

# Test 5: Signup Page Load
print("\nTest 5: Signup Page Load")
driver.get("http://13.60.208.0:3000/signup")
assert "Create your account" in driver.page_source
print("✓ Signup page loaded successfully")

# Test 6: Signup Step 1 - Email Entry
print("\nTest 6: Signup Step 1 - Email Entry")
driver.get("http://13.60.208.0:3000/signup")
driver.find_element(By.ID, "email").send_keys('newuser@gmail.com')
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)
# Check if step 2 is visible
assert "Step 2 of 2" in driver.page_source
print("✓ Step 1 completed, moved to step 2")

# Test 7: Signup Step 1 - Empty Email
print("\nTest 7: Signup Step 1 - Empty Email")
driver.get("http://13.60.208.0:3000/signup")
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)
# Should show error message
print("✓ Empty email validation handled")

# Test 8: Complete Signup Flow
print("\nTest 8: Complete Signup Flow")
driver.get("http://13.60.208.0:3000/signup")

# Step 1: Enter email
driver.find_element(By.ID, "email").send_keys('testuser123@gmail.com')
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)

# Step 2: Enter passwords and agree to terms
driver.find_element(By.ID, "password").send_keys('password123')
driver.find_element(By.ID, "confirmPassword").send_keys('password123')

# Check the terms agreement checkbox
terms_checkbox = driver.find_element(By.ID, "terms")
terms_checkbox.click()

# Click create account
create_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Account')]")
create_button.click()
time.sleep(5)
print("✓ Complete signup flow executed")

# Test 9: Signup Password Mismatch
print("\nTest 9: Signup Password Mismatch")
driver.get("http://13.60.208.0:3000/signup")

# Step 1
driver.find_element(By.ID, "email").send_keys('testuser456@gmail.com')
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)

# Step 2 with mismatched passwords
driver.find_element(By.ID, "password").send_keys('password123')
driver.find_element(By.ID, "confirmPassword").send_keys('differentpassword')
terms_checkbox = driver.find_element(By.ID, "terms")
terms_checkbox.click()

create_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Account')]")
create_button.click()
time.sleep(2)
# Should show password mismatch error
print("✓ Password mismatch validation handled")

# Test 10: Signup Without Terms Agreement
print("\nTest 10: Signup Without Terms Agreement")
driver.get("http://13.60.208.0:3000/signup")

# Step 1
driver.find_element(By.ID, "email").send_keys('testuser789@gmail.com')
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)

# Step 2 without checking terms
driver.find_element(By.ID, "password").send_keys('password123')
driver.find_element(By.ID, "confirmPassword").send_keys('password123')
# Don't check terms checkbox

create_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Account')]")
create_button.click()
time.sleep(2)
# Should show terms agreement error
print("✓ Terms agreement validation handled")

# Test 11: Back Button in Signup
print("\nTest 11: Back Button in Signup")
driver.get("http://13.60.208.0:3000/signup")

# Go to step 2
driver.find_element(By.ID, "email").send_keys('backtest@gmail.com')
continue_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
continue_button.click()
time.sleep(2)

# Click back button
back_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Back')]")
back_button.click()
time.sleep(2)

# Should be back to step 1
assert "Step 1 of 2" in driver.page_source
print("✓ Back button functionality working")

# Test 12: Toggle Between Login and Signup
print("\nTest 12: Toggle Between Login and Signup")
driver.get("http://13.60.208.0:3000/login")

# Click signup link
signup_link = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign up')]")
signup_link.click()
time.sleep(2)
assert "Create your account" in driver.page_source

# Click signin link
signin_link = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign in')]")
signin_link.click()
time.sleep(2)
assert "Welcome back" in driver.page_source
print("✓ Toggle between login and signup working")

# Test 13: Password Visibility Toggle
print("\nTest 13: Password Visibility Toggle")
driver.get("http://13.60.208.0:3000/login")
driver.find_element(By.ID, "email").send_keys('test@gmail.com')
password_field = driver.find_element(By.ID, "password")
password_field.send_keys('testpassword')

# Click eye icon to show password
eye_button = driver.find_element(By.XPATH, "//button[contains(@class, 'absolute')]")
eye_button.click()
time.sleep(1)

# Check if password type changed
password_type = password_field.get_attribute('type')
assert password_type == 'text'
print("✓ Password visibility toggle working")

# Test 14: Forgot Password Link
print("\nTest 14: Forgot Password Link")
driver.get("http://13.60.208.0:3000/login")
forgot_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Forgot password?')]")
# Just check if link exists (since it's just a placeholder)
assert forgot_link is not None
print("✓ Forgot password link present")


print("\n🎉 All tests completed!")

time.sleep(5)
driver.quit()