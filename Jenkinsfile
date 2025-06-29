pipeline {
    agent any

    environment {
        DOCKER_PROJECT_NAME = 'thereactapp'
        APP_URL = 'http://localhost:3000'
        CONTAINER_NAME = 'thereactapp-rinxo-1'
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
                        if [ ! -d "test-env" ]; then
                            python3 -m venv test-env
                        fi
                        
                        . test-env/bin/activate
                        pip install --upgrade pip
                        pip install selenium webdriver-manager
                        
                        if ! command -v google-chrome &> /dev/null; then
                            wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
                            sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
                            sudo apt update
                            sudo apt install -y google-chrome-stable
                        fi
                        
                        if [ ! -f "/usr/local/bin/chromedriver" ]; then
                            CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d. -f1)
                            wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}/chromedriver_linux64.zip"
                            sudo unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/
                            sudo chmod +x /usr/local/bin/chromedriver
                        fi
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
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(10)
        return driver
    except Exception as e:
        print(f"Failed to initialize Chrome driver: {e}")
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
            }
        }
        
        success {
            echo 'Pipeline completed successfully! Application is deployed and tested.'
        }
        
        failure {
            script {
                echo 'Pipeline failed. Checking logs...'
                sh '''
                    echo "=== Container Logs ==="
                    docker logs ${ACTUAL_CONTAINER_NAME} --tail 20 || echo "Could not get container logs"
                    
                    echo "=== Container Status ==="
                    docker ps -f name=thereactapp-rinxo || echo "Could not get container status"
                '''
            }
        }
        
        unstable {
            echo 'Pipeline completed with test failures. Application deployed but some tests failed.'
        }
    }
}