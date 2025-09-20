import requests
import sys
import json
from datetime import datetime

class BackendAPITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, check_content_type=None, check_size=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n[*] Testing {name}...")
        print(f"   URL: {url}")

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)

            print(f"   Status Code: {response.status_code}")
            print(f"   Content-Type: {response.headers.get('Content-Type', 'Not set')}")

            success = response.status_code == expected_status

            # Check content type if specified
            if check_content_type and success:
                actual_content_type = response.headers.get('Content-Type', '')
                if check_content_type not in actual_content_type:
                    print(f"   [-] Content-Type mismatch: expected '{check_content_type}', got '{actual_content_type}'")
                    success = False
                else:
                    print(f"   [+] Content-Type matches: {actual_content_type}")

            # Check response size if specified
            if check_size and success:
                content_length = len(response.content)
                print(f"   Response size: {content_length} bytes")
                if content_length < check_size:
                    print(f"   [-] Response too small: expected >{check_size} bytes, got {content_length}")
                    success = False
                else:
                    print(f"   [+] Response size OK: {content_length} bytes")

            if success:
                self.tests_passed += 1
                print(f"[+] {name} - PASSED")
                try:
                    if response.headers.get('Content-Type', '').startswith('application/json'):
                        return success, response.json()
                    else:
                        return success, response.content
                except:
                    return success, response.content
            else:
                print(f"[-] {name} - FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_body = response.text
                    print(f"   Error response: {error_body}")
                except:
                    pass
                return False, {}

        except Exception as e:
            print(f"[-] {name} - FAILED - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        success, response = self.run_test(
            "Root Endpoint",
            "GET",
            "",
            200
        )
        if success and isinstance(response, dict):
            if response.get('message') == 'Hello World':
                print("   [+] Message content correct")
                return True
            else:
                print(f"   [-] Message content incorrect: {response}")
                return False
        return success

    def test_generate_endpoint(self):
        """Test POST /api/generate endpoint"""
        success, response = self.run_test(
            "Generate Spreadsheet",
            "POST",
            "generate",
            200,
            data={"description": "test sheet", "provider": "auto"},
            check_content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            check_size=10240  # 10KB minimum
        )
        return success

    def test_generate_file_size_threshold(self):
        """Test POST /api/generate with specific file size threshold requirements"""
        print(f"\n[TARGET] SPECIFIC TEST: File Size Threshold")
        url = f"{self.api_url}/generate"
        data = {"description": "bigger file test", "provider": "auto"}

        try:
            response = requests.post(url, json=data, timeout=30)

            print(f"   URL: {url}")
            print(f"   Request Data: {data}")
            print(f"   Status Code: {response.status_code}")

            # Check status code
            if response.status_code != 200:
                print(f"[-] Expected status 200, got {response.status_code}")
                return False

            # Check content type
            content_type = response.headers.get('content-type', '')
            expected_content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            print(f"   Content-Type: {content_type}")
            if content_type != expected_content_type:
                print(f"[-] Expected content-type '{expected_content_type}', got '{content_type}'")
                return False

            # Check file size
            file_size = len(response.content)
            print(f"   File Size: {file_size} bytes")
            if file_size <= 20000:
                print(f"[-] Expected file size > 20000 bytes, got {file_size} bytes")
                return False

            print(f"[+] Status: {response.status_code}")
            print(f"[+] Content-Type: {content_type}")
            print(f"[+] File Size: {file_size} bytes (> 20000)")
            print(f"[CLIPBOARD] All Response Headers:")
            for key, value in response.headers.items():
                print(f"   {key}: {value}")

            self.tests_passed += 1
            return True

        except Exception as e:
            print(f"[-] Request failed: {str(e)}")
            return False

    def test_generations_endpoint(self):
        """Test GET /api/generations endpoint"""
        success, response = self.run_test(
            "List Generations",
            "GET",
            "generations",
            200
        )
        if success and isinstance(response, list):
            print(f"   [+] Returned array with {len(response)} items")
            if len(response) > 0:
                first_item = response[0]
                required_fields = ['id', 'description', 'provider', 'filename', 'size_bytes', 'created_at']
                missing_fields = []
                for field in required_fields:
                    if field not in first_item:
                        missing_fields.append(field)

                if missing_fields:
                    print(f"   [-] Missing fields in first item: {missing_fields}")
                    return False
                else:
                    print(f"   [+] All required fields present in first item")

                # Check size_bytes > 0
                if first_item.get('size_bytes', 0) > 0:
                    print(f"   [+] size_bytes > 0: {first_item['size_bytes']}")
                else:
                    print(f"   [-] size_bytes not > 0: {first_item.get('size_bytes')}")
                    return False
            return True
        return success

    def test_generations_size_threshold(self):
        """Test GET /api/generations and verify latest item has size_bytes > 20000"""
        print(f"\n[TARGET] SPECIFIC TEST: Generations Size Threshold")
        url = f"{self.api_url}/generations"

        try:
            response = requests.get(url, timeout=10)

            print(f"   URL: {url}")
            print(f"   Status Code: {response.status_code}")

            if response.status_code != 200:
                print(f"[-] Expected status 200, got {response.status_code}")
                return False

            generations = response.json()
            if not generations:
                print("[-] No generations found")
                return False

            print(f"   Found {len(generations)} generations")

            # Get the latest generation (first in the list since it's sorted by created_at desc)
            latest = generations[0]
            size_bytes = latest.get('size_bytes', 0)

            print(f"   Latest generation size: {size_bytes} bytes")

            if size_bytes <= 20000:
                print(f"[-] Expected latest generation size_bytes > 20000, got {size_bytes}")
                return False

            print(f"[+] Latest generation size: {size_bytes} bytes (> 20000)")
            print(f"[CLIPBOARD] Latest generation details:")
            print(f"   ID: {latest.get('id')}")
            print(f"   Description: {latest.get('description')}")
            print(f"   Provider: {latest.get('provider')}")
            print(f"   Filename: {latest.get('filename')}")
            print(f"   Size: {size_bytes} bytes")
            print(f"   Created: {latest.get('created_at')}")

            self.tests_passed += 1
            return True

        except Exception as e:
            print(f"[-] Request failed: {str(e)}")
            return False

    def test_auth_register(self, email, password):
        """Test POST /api/auth/register endpoint"""
        success, response = self.run_test(
            "Auth Register",
            "POST",
            "auth/register",
            200,
            data={"email": email, "password": password}
        )
        if success and isinstance(response, dict):
            if response.get('ok') == True:
                print("   [+] Registration successful")
                return True
            else:
                print(f"   [-] Registration response incorrect: {response}")
                return False
        return success

    def test_auth_login(self, email, password):
        """Test POST /api/auth/login endpoint"""
        success, response = self.run_test(
            "Auth Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and isinstance(response, dict):
            if 'access_token' in response:
                self.token = response['access_token']
                print(f"   [+] Login successful, token received")
                return True
            else:
                print(f"   [-] No access_token in response: {response}")
                return False
        return success

def main():
    print("[ROCKET] Starting File Size Threshold Tests")
    print("=" * 50)

    # Setup
    tester = BackendAPITester()

    # Run the specific tests requested by main agent
    print("\n[CLIPBOARD] FOCUSED Test Plan (File Size Threshold):")
    print("1. POST /api/generate with 'bigger file test' - verify status 200, content-type xlsx, size > 20000")
    print("2. GET /api/generations - verify latest item has size_bytes > 20000")

    # Initialize test counters for focused tests
    tester.tests_run = 0
    tester.tests_passed = 0

    # Test 1: Generate endpoint with file size threshold
    test1_success = tester.test_generate_file_size_threshold()
    tester.tests_run += 1

    # Test 2: Generations endpoint with size threshold
    test2_success = tester.test_generations_size_threshold()
    tester.tests_run += 1

    # Print final results
    print("\n" + "=" * 50)
    print(f"[STATS] FOCUSED TEST RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")

    if tester.tests_passed == tester.tests_run:
        print("[CELEBRATION] All file size threshold tests PASSED!")
        return 0
    else:
        print(f"[WARNING] {tester.tests_run - tester.tests_passed} file size threshold tests FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())