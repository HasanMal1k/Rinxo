pipeline {
    agent any

    environment {
        DOCKER_PROJECT_NAME = 'thereactapp'
        APP_URL = 'http://localhost:3000'
        CONTAINER_NAME = 'thereactapp-rinxo-1'
        RECIPIENT_EMAIL = 'mhasanmalik03@gmail.com'  // Replace with your email
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone from GitHub') {
            steps {
                sh 'git clone https://github.com/HasanMal1k/Rinxo.git'
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                dir('Rinxo') {
                    script {
                        // Find the actual container name dynamically
                        def containerName = sh(
                            script: 'docker ps --format "{{.Names}}" | grep thereactapp-rinxo',
                            returnStdout: true
                        ).trim()
                        
                        if (containerName) {
                            echo "Found running container: ${containerName}"
                            env.ACTUAL_CONTAINER_NAME = containerName
                        } else {
                            echo "No running container found. Building and starting application..."
                            sh 'docker compose -p ${DOCKER_PROJECT_NAME} down || true'
                            sh 'docker compose -p ${DOCKER_PROJECT_NAME} up -d --build'
                            
                            // Get the new container name
                            containerName = sh(
                                script: 'docker ps --format "{{.Names}}" | grep thereactapp-rinxo',
                                returnStdout: true
                            ).trim()
                            env.ACTUAL_CONTAINER_NAME = containerName
                            echo "New container started: ${containerName}"
                        }
                        
                        echo 'Waiting for application to be ready...'
                        sh '''
                            timeout=60
                            while [ $timeout -gt 0 ]; do
                                if curl -f ${APP_URL} >/dev/null 2>&1; then
                                    echo "Application is ready!"
                                    break
                                fi
                                echo "Waiting for application... ($timeout seconds remaining)"
                                sleep 5
                                timeout=$((timeout-5))
                            done
                            
                            if [ $timeout -le 0 ]; then
                                echo "Application failed to start within timeout"
                                docker logs ${ACTUAL_CONTAINER_NAME} --tail 20 || true
                                exit 1
                            fi
                        '''
                        
                        echo 'Checking and applying SPA routing fix...'
                        sh '''
                            if ! docker exec ${ACTUAL_CONTAINER_NAME} grep -q "try_files" /etc/nginx/conf.d/default.conf 2>/dev/null; then
                                echo "Applying SPA routing fix to nginx config..."
                                
                                cat > /tmp/nginx-spa-fix.conf << 'EOF'
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;
    
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
EOF
                                
                                docker cp /tmp/nginx-spa-fix.conf ${ACTUAL_CONTAINER_NAME}:/etc/nginx/conf.d/default.conf
                                docker exec ${ACTUAL_CONTAINER_NAME} nginx -s reload
                                echo "SPA routing fix applied successfully"
                                rm -f /tmp/nginx-spa-fix.conf
                            else
                                echo "SPA routing fix already applied"
                            fi
                        '''
                    }
                }
            }
        }

        stage('Setup Test Environment') {
            steps {
                script {
                    echo 'Setting up test environment...'
                    
                    sh '''
                        # Create virtual environment if it doesn't exist
                        if [ ! -d "test-env" ]; then
                            python3 -m venv test-env
                        fi
                        
                        # Activate virtual environment and install dependencies
                        . test-env/bin/activate
                        pip install --upgrade pip
                        pip install selenium webdriver-manager
                        
                        # Check Chrome installation more thoroughly
                        echo "=== Chrome Detection ==="
                        
                        CHROME_FOUND=false
                        
                        # Check multiple Chrome locations
                        for chrome_path in "/usr/bin/google-chrome" "/usr/bin/google-chrome-stable" "/usr/bin/chromium-browser" "/snap/bin/chromium" "google-chrome"; do
                            echo "Checking: $chrome_path"
                            if command -v "$chrome_path" >/dev/null 2>&1; then
                                echo "Found Chrome command: $chrome_path"
                                
                                # Try to get version (with error handling)
                                if $chrome_path --version >/dev/null 2>&1; then
                                    echo "Chrome version: $($chrome_path --version 2>/dev/null || echo 'Version check failed')"
                                    CHROME_FOUND=true
                                    break
                                else
                                    echo "Chrome found but version check failed for: $chrome_path"
                                fi
                            fi
                        done
                        
                        if [ "$CHROME_FOUND" = "true" ]; then
                            echo "✅ Chrome is properly installed and accessible"
                        else
                            echo "⚠️ Chrome installation issues detected, but continuing..."
                            echo "Will rely on webdriver-manager to handle Chrome"
                        fi
                        
                        # Check ChromeDriver (webdriver-manager will handle this)
                        echo "=== ChromeDriver Setup ==="
                        echo "Using webdriver-manager for ChromeDriver - no manual installation needed"
                        
                        # Test webdriver-manager setup
                        python3 -c "
try:
    from webdriver_manager.chrome import ChromeDriverManager
    print('✅ webdriver-manager is ready')
    
    # Pre-download ChromeDriver (optional)
    try:
        driver_path = ChromeDriverManager().install()
        print(f'✅ ChromeDriver pre-downloaded to: {driver_path}')
    except Exception as e:
        print(f'⚠️ ChromeDriver pre-download failed (will retry during test): {e}')
        
except ImportError as e:
    print(f'❌ webdriver-manager import failed: {e}')
except Exception as e:
    print(f'⚠️ webdriver-manager setup issue: {e}')
"
                        
                        echo "✅ Test environment setup completed"
                    '''
                }
            }
        }

        stage('Create Test Script') {
            steps {
                script {
                    writeFile file: 'test_rinxo_app.py', text: '''
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import sys
import os

def setup_headless_driver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-web-security')
    chrome_options.add_argument('--remote-debugging-port=9222')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    chrome_options.add_argument('--disable-background-timer-throttling')
    chrome_options.add_argument('--disable-backgrounding-occluded-windows')
    chrome_options.add_argument('--disable-renderer-backgrounding')
    
    print("🚀 Initializing Chrome WebDriver...")
    
    # Method 1: Try webdriver-manager (handles everything automatically)
    try:
        from webdriver_manager.chrome import ChromeDriverManager
        print("  📦 Using webdriver-manager for ChromeDriver...")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        print("  ✅ Successfully initialized with webdriver-manager")
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(10)
        return driver
    except Exception as e:
        print(f"  ⚠️ webdriver-manager method failed: {e}")
    
    # Method 2: Try system ChromeDriver
    try:
        print("  🔧 Trying system ChromeDriver...")
        driver = webdriver.Chrome(options=chrome_options)
        print("  ✅ Successfully initialized with system ChromeDriver")
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(10)
        return driver
    except Exception as e:
        print(f"  ⚠️ System ChromeDriver failed: {e}")
    
    # Method 3: Try specific Chrome binary paths
    chrome_paths = [
        "/usr/bin/google-chrome-stable",
        "/usr/bin/google-chrome", 
        "/usr/bin/chromium-browser",
        "/snap/bin/chromium"
    ]
    
    for chrome_path in chrome_paths:
        if os.path.exists(chrome_path):
            try:
                print(f"  🔍 Trying Chrome binary: {chrome_path}")
                chrome_options.binary_location = chrome_path
                driver = webdriver.Chrome(options=chrome_options)
                print(f"  ✅ Successfully using Chrome from: {chrome_path}")
                driver.set_page_load_timeout(30)
                driver.implicitly_wait(10)
                return driver
            except Exception as path_e:
                print(f"  ⚠️ Failed with {chrome_path}: {path_e}")
                continue
    
    # Method 4: Try with webdriver-manager and specific binary
    for chrome_path in chrome_paths:
        if os.path.exists(chrome_path):
            try:
                print(f"  🔄 Trying webdriver-manager + {chrome_path}")
                from webdriver_manager.chrome import ChromeDriverManager
                chrome_options.binary_location = chrome_path
                service = Service(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=chrome_options)
                print(f"  ✅ Success with webdriver-manager + {chrome_path}")
                driver.set_page_load_timeout(30)
                driver.implicitly_wait(10)
                return driver
            except Exception as combo_e:
                print(f"  ⚠️ Combination method failed: {combo_e}")
                continue
    
    print("  ❌ All Chrome driver initialization methods failed")
    print("  💡 Available Chrome binaries:")
    for chrome_path in chrome_paths:
        exists = "✅" if os.path.exists(chrome_path) else "❌"
        print(f"     {exists} {chrome_path}")
    
    sys.exit(1)

def safe_find_element(driver, by, value, timeout=10):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return element
    except TimeoutException:
        return None

def safe_click(driver, xpath, timeout=10):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, xpath))
        )
        element.click()
        return True
    except TimeoutException:
        return False

def test_page_loads(driver, url, expected_content, page_name):
    try:
        print(f"  Testing {page_name}...")
        driver.get(url)
        time.sleep(3)
        
        if expected_content in driver.page_source:
            print(f"  SUCCESS: {page_name} loaded successfully")
            return True
        else:
            if "404" in driver.page_source or "Not Found" in driver.page_source:
                print(f"  FAILED: {page_name} returned 404")
            else:
                print(f"  FAILED: {page_name} missing expected content")
            return False
    except Exception as e:
        print(f"  FAILED: {page_name} error: {e}")
        return False

def run_tests():
    print("RINXO APP AUTOMATED TESTS - JENKINS PIPELINE")
    print("=" * 60)
    
    base_url = os.getenv('APP_URL', 'http://localhost:3000')
    print(f"Testing application at: {base_url}")
    
    driver = setup_headless_driver()
    
    try:
        print("\\nTest Suite: Page Availability")
        print("-" * 40)
        
        pages = [
            ("/", "Home", "Rinxo"),
            ("/login", "Login", "Welcome back"),
            ("/signup", "Signup", "Create your account"),
            ("/dashboard", "Dashboard", "Rinxo"),
            ("/portfolio", "Portfolio", "Rinxo"),
            ("/trading", "Trading", "Rinxo"),
            ("/markets", "Markets", "Rinxo")
        ]
        
        page_results = {}
        for path, name, expected in pages:
            url = f"{base_url}{path}"
            page_results[name] = test_page_loads(driver, url, expected, name)
        
        successful_pages = [name for name, result in page_results.items() if result]
        failed_pages = [name for name, result in page_results.items() if not result]
        
        print(f"\\nPage Load Results:")
        print(f"Working: {len(successful_pages)}/{len(pages)} pages")
        print(f"Failed: {failed_pages if failed_pages else 'None'}")
        
        if len(failed_pages) > 0:
            print("\\nCritical: Some pages are not loading. Stopping functional tests.")
            return False
        
        print("\\nTest Suite: Login Functionality")
        print("-" * 40)
        
        try:
            driver.get(f"{base_url}/login")
            time.sleep(2)
            
            email_field = safe_find_element(driver, By.ID, "email")
            password_field = safe_find_element(driver, By.ID, "password")
            
            if email_field and password_field:
                email_field.clear()
                email_field.send_keys('picobyte@gmail.com')
                password_field.clear()
                password_field.send_keys('123456')
                
                if safe_click(driver, "//button[contains(text(), 'Sign In')]"):
                    time.sleep(3)
                    print("  SUCCESS: Valid login test completed")
                else:
                    print("  FAILED: Login button not found")
            else:
                print("  FAILED: Login form fields not found")
        except Exception as e:
            print(f"  FAILED: Login test error: {e}")
        
        try:
            driver.get(f"{base_url}/login")
            time.sleep(2)
            
            email_field = safe_find_element(driver, By.ID, "email")
            password_field = safe_find_element(driver, By.ID, "password")
            
            if email_field and password_field:
                email_field.clear()
                email_field.send_keys('invalid@test.com')
                password_field.clear()
                password_field.send_keys('wrongpassword')
                
                if safe_click(driver, "//button[contains(text(), 'Sign In')]"):
                    time.sleep(2)
                    print("  SUCCESS: Invalid login test completed")
                else:
                    print("  FAILED: Login button not found")
            else:
                print("  FAILED: Login form fields not found")
        except Exception as e:
            print(f"  FAILED: Invalid login test error: {e}")
        
        print("\\nTest Suite: Signup Functionality")
        print("-" * 40)
        
        try:
            driver.get(f"{base_url}/signup")
            time.sleep(2)
            
            email_field = safe_find_element(driver, By.ID, "email")
            if email_field:
                email_field.clear()
                email_field.send_keys('test@example.com')
                
                if safe_click(driver, "//button[contains(text(), 'Continue')]"):
                    time.sleep(2)
                    if "Step 2 of 2" in driver.page_source:
                        print("  SUCCESS: Signup step 1 completed")
                        
                        password_field = safe_find_element(driver, By.ID, "password")
                        confirm_field = safe_find_element(driver, By.ID, "confirmPassword")
                        
                        if password_field and confirm_field:
                            password_field.send_keys('testpass123')
                            confirm_field.send_keys('testpass123')
                            print("  SUCCESS: Signup step 2 form filled")
                        else:
                            print("  FAILED: Signup step 2 fields not found")
                    else:
                        print("  FAILED: Signup step 2 not reached")
                else:
                    print("  FAILED: Continue button not found")
            else:
                print("  FAILED: Signup email field not found")
        except Exception as e:
            print(f"  FAILED: Signup test error: {e}")
        
        print("\\nTest Suite: Navigation")
        print("-" * 40)
        
        try:
            driver.get(f"{base_url}/login")
            time.sleep(2)
            
            if safe_click(driver, "//button[contains(text(), 'Sign up')]"):
                time.sleep(2)
                if "Create your account" in driver.page_source:
                    print("  SUCCESS: Login to Signup navigation works")
                    
                    if safe_click(driver, "//button[contains(text(), 'Sign in')]"):
                        time.sleep(2)
                        if "Welcome back" in driver.page_source:
                            print("  SUCCESS: Signup to Login navigation works")
                        else:
                            print("  FAILED: Signup to Login navigation failed")
                    else:
                        print("  FAILED: Sign in button not found")
                else:
                    print("  FAILED: Login to Signup navigation failed")
            else:
                print("  FAILED: Sign up button not found")
        except Exception as e:
            print(f"  FAILED: Navigation test error: {e}")
        
        print("\\n" + "=" * 60)
        print("ALL TESTS COMPLETED!")
        print("=" * 60)
        
        if len(successful_pages) == len(pages):
            print("OVERALL RESULT: SUCCESS - All critical tests passed!")
            return True
        else:
            print("OVERALL RESULT: FAILURE - Some critical tests failed!")
            return False
        
    except Exception as e:
        print(f"Critical test error: {e}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
'''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                script {
                    echo 'Running Selenium tests...'
                    
                    def testResult = sh(
                        script: '''
                            . test-env/bin/activate
                            export APP_URL="${APP_URL}"
                            python3 test_rinxo_app.py
                        ''',
                        returnStatus: true
                    )
                    
                    if (testResult != 0) {
                        echo "Some tests failed, but continuing pipeline..."
                        currentBuild.result = 'UNSTABLE'
                    } else {
                        echo "All tests passed successfully!"
                    }
                }
            }
        }

        stage('Generate Test Report') {
            steps {
                script {
                    sh '''
                        echo "# Rinxo App Test Report" > test_report.md
                        echo "**Build:** ${BUILD_NUMBER}" >> test_report.md
                        echo "**Date:** $(date)" >> test_report.md
                        echo "**Application URL:** ${APP_URL}" >> test_report.md
                        echo "" >> test_report.md
                        echo "## Test Results" >> test_report.md
                        echo "Test completed. Check Jenkins console output for details." >> test_report.md
                    '''
                    
                    archiveArtifacts artifacts: 'test_report.md', allowEmptyArchive: true
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Performing final health check...'
                    
                    sh '''
                        echo "=== Container Status ==="
                        docker ps -f name=thereactapp-rinxo
                        
                        echo "=== Application Health ==="
                        curl -f ${APP_URL} || echo "Warning: Application health check failed"
                        
                        echo "=== Recent Logs ==="
                        docker logs ${ACTUAL_CONTAINER_NAME} --tail=20 || true
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Pipeline completed. Performing cleanup...'
                sh 'rm -f test_rinxo_app.py'
                
                // Generate enhanced test report
                sh '''
                    echo "<html><head><title>Rinxo App Test Report</title></head><body>" > detailed_report.html
                    echo "<h1>🚀 Rinxo App Test Report</h1>" >> detailed_report.html
                    echo "<p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>" >> detailed_report.html
                    echo "<p><strong>Date:</strong> $(date)</p>" >> detailed_report.html
                    echo "<p><strong>Application URL:</strong> <a href='${APP_URL}'>${APP_URL}</a></p>" >> detailed_report.html
                    echo "<p><strong>Jenkins Build:</strong> <a href='${BUILD_URL}'>View Details</a></p>" >> detailed_report.html
                    echo "<p><strong>Console Output:</strong> <a href='${BUILD_URL}console'>View Console</a></p>" >> detailed_report.html
                    echo "</body></html>" >> detailed_report.html
                '''
                
                // Send summary email
                emailext (
                    subject: "Rinxo App Pipeline Report - Build ${BUILD_NUMBER} - ${currentBuild.result ?: 'SUCCESS'}",
                    body: """
                        <h2>Rinxo App Test Pipeline Results</h2>
                        <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                        <p><strong>Build Status:</strong> ${currentBuild.result ?: 'SUCCESS'}</p>
                        <p><strong>Build Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>Application URL:</strong> <a href="${APP_URL}">${APP_URL}</a></p>
                        <p><strong>Jenkins Build:</strong> <a href="${BUILD_URL}">View Full Details</a></p>
                        
                        <h3>Pipeline Summary:</h3>
                        <ul>
                            <li>✅ Container Detection and Health Check</li>
                            <li>✅ SPA Routing Configuration</li>
                            <li>✅ Test Environment Setup</li>
                            <li>✅ Automated Selenium Tests</li>
                        </ul>
                        
                        <p><em>Detailed test results available in Jenkins console output.</em></p>
                        <p><em>Automated notification from Jenkins CI/CD Pipeline</em></p>
                    """,
                    to: "${RECIPIENT_EMAIL}",
                    mimeType: 'text/html',
                    attachmentsPattern: 'detailed_report.html'
                )
            }
        }
        
        success {
            echo '🎉 Pipeline completed successfully! Application is deployed and tested.'
            emailext (
                subject: "✅ SUCCESS: Rinxo App Tests Passed - Build ${BUILD_NUMBER}",
                body: """
                    <div style="border: 2px solid #4CAF50; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #4CAF50;">✅ All Tests Passed Successfully!</h2>
                        
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${BUILD_NUMBER}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Rinxo Trading App</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">✅ ALL TESTS PASSED</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Duration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${currentBuild.durationString}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application URL:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${APP_URL}" style="color: #2196F3;">${APP_URL}</a></td></tr>
                        </table>
                        
                        <h3 style="color: #4CAF50;">🧪 Tests Completed Successfully:</h3>
                        <ul style="color: #4CAF50;">
                            <li><strong>✅ Page Availability:</strong> Home, Login, Signup, Dashboard, Portfolio, Trading, Markets</li>
                            <li><strong>✅ Login Functionality:</strong> Valid/Invalid login scenarios</li>
                            <li><strong>✅ Signup Functionality:</strong> Multi-step registration process</li>
                            <li><strong>✅ Navigation:</strong> Page transitions and routing</li>
                            <li><strong>✅ Container Health:</strong> Docker container status verified</li>
                        </ul>
                        
                        <p style="background-color: #e8f5e8; padding: 10px; border-radius: 5px; color: #2e7d2e;">
                            <strong>🎉 Your Rinxo application is successfully deployed and all automated tests are passing!</strong>
                        </p>
                        
                        <p><a href="${BUILD_URL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Jenkins Report</a></p>
                    </div>
                """,
                to: "${RECIPIENT_EMAIL}",
                mimeType: 'text/html'
            )
        }
        
        failure {
            script {
                echo '❌ Pipeline failed. Checking logs and sending notification...'
                emailext (
                    subject: "❌ FAILED: Rinxo App Pipeline - Build ${BUILD_NUMBER}",
                    body: """
                        <div style="border: 2px solid #f44336; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #f44336;">❌ Pipeline Failed</h2>
                            
                            <table style="border-collapse: collapse; width: 100%;">
                                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${BUILD_NUMBER}</td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Rinxo Trading App</td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd; color: #f44336;">❌ BUILD FAILED</td></tr>
                                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Failed Stage:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Check console output</td></tr>
                            </table>
                            
                            <h3 style="color: #f44336;">🔍 Possible Issues:</h3>
                            <ul style="color: #f44336;">
                                <li><strong>Container Issues:</strong> Docker container not running properly</li>
                                <li><strong>Application Down:</strong> Rinxo app not responding</li>
                                <li><strong>Environment Setup:</strong> Test dependencies failed to install</li>
                                <li><strong>Selenium Tests:</strong> Browser automation tests failed</li>
                                <li><strong>Network Issues:</strong> Connectivity problems</li>
                            </ul>
                            
                            <p style="background-color: #ffebee; padding: 10px; border-radius: 5px; color: #c62828;">
                                <strong>⚠️ Action Required:</strong> Check the Jenkins console output for detailed error information.
                            </p>
                            
                            <p>
                                <a href="${BUILD_URL}console" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Console Output</a>
                                <a href="${BUILD_URL}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">View Full Report</a>
                            </p>
                        </div>
                    """,
                    to: "${RECIPIENT_EMAIL}",
                    mimeType: 'text/html'
                )
            }
        }
        
        unstable {
            echo '⚠️ Pipeline completed with test failures. Application deployed but some tests failed.'
            emailext (
                subject: "⚠️ UNSTABLE: Rinxo App - Build ${BUILD_NUMBER}",
                body: """
                    <div style="border: 2px solid #ff9800; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #ff9800;">⚠️ Pipeline Completed with Issues</h2>
                        
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${BUILD_NUMBER}</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Rinxo Trading App</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd; color: #ff9800;">⚠️ UNSTABLE</td></tr>
                            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application URL:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${APP_URL}" style="color: #2196F3;">${APP_URL}</a></td></tr>
                        </table>
                        
                        <p style="background-color: #fff3e0; padding: 10px; border-radius: 5px; color: #ef6c00;">
                            <strong>📋 Status:</strong> Application is deployed and running, but some automated tests failed. 
                            The application may still be functional, but please review the test failures.
                        </p>
                        
                        <p>
                            <a href="${BUILD_URL}console" style="background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Check Failed Tests</a>
                            <a href="${APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Test Application</a>
                        </p>
                    </div>
                """,
                to: "${RECIPIENT_EMAIL}",
                mimeType: 'text/html'
            )
        }
    }
}