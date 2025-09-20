import requests
import sys
from datetime import datetime

class AuthTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n[*] Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Data: {data}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Status Code: {response.status_code}")
            print(f"   Response: {response.text}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"[+] {name} - PASSED")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"[-] {name} - FAILED - Expected {expected_status}, got {response.status_code}")
                return False, response.text

        except Exception as e:
            print(f"[-] {name} - FAILED - Error: {str(e)}")
            return False, str(e)

    def test_register(self, email, password):
        """Test registration"""
        success, response = self.run_test(
            "Register",
            "POST",
            "auth/register",
            200,
            data={"email": email, "password": password}
        )
        return success

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and isinstance(response, dict) and 'access_token' in response:
            self.token = response['access_token']
            print(f"   [+] Token received: {self.token[:20]}...")
            return True
        return False

def main():
    print("[LOCK] Testing Authentication Flow")
    print("=" * 50)

    # Setup
    tester = AuthTester()

    # Generate unique email with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_email = f"auth_test_{timestamp}@example.com"
    test_password = "TestPass123!"

    print(f"Using test email: {test_email}")
    print(f"Using test password: {test_password}")

    # Test registration
    if not tester.test_register(test_email, test_password):
        print("[-] Registration failed, stopping tests")
        return 1

    # Test login
    if not tester.test_login(test_email, test_password):
        print("[-] Login failed")
        return 1

    # Print results
    print(f"\n[STATS] Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())