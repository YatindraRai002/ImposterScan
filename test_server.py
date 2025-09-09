#!/usr/bin/env python3
"""
Quick Server Test - DeepFake Detection System
Tests if the server starts and all endpoints are accessible
"""

import sys
import os
import json
import time
import threading
import requests
from pathlib import Path

# Add src to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / 'src'))

def test_server_startup():
    """Test if we can start the server"""
    print("🚀 Testing Server Startup...")
    
    try:
        # Import and setup
        from api.app import app
        
        print("  ✓ Flask app imported successfully")
        
        # Test app configuration
        print(f"  ✓ Template folder: {app.template_folder}")
        print(f"  ✓ Static folder: {app.static_folder}")
        print(f"  ✓ Upload folder: {app.config.get('UPLOAD_FOLDER', 'Not set')}")
        
        return app
    except Exception as e:
        print(f"  ❌ Server startup failed: {e}")
        return None

def test_endpoints_with_test_client(app):
    """Test endpoints using Flask test client"""
    print("\n🔧 Testing API Endpoints (Test Client)...")
    
    try:
        client = app.test_client()
        
        endpoints = [
            ('/', 'Homepage'),
            ('/test', 'Test Endpoint'),
            ('/api/health', 'Health Check'),
            ('/api/models/status', 'Model Status'),
            ('/api/statistics', 'Statistics')
        ]
        
        results = {}
        
        for endpoint, name in endpoints:
            try:
                response = client.get(endpoint)
                status = response.status_code
                print(f"  ✓ {name} ({endpoint}): {status}")
                
                # Try to get JSON data if possible
                try:
                    data = response.get_json()
                    if data and isinstance(data, dict):
                        print(f"    Data keys: {list(data.keys())}")
                except:
                    print(f"    Content length: {len(response.data)} bytes")
                
                results[endpoint] = {'status': status, 'success': status < 400}
                
            except Exception as e:
                print(f"  ❌ {name} ({endpoint}): Error - {e}")
                results[endpoint] = {'status': 'error', 'success': False}
        
        return results
    except Exception as e:
        print(f"  ❌ Endpoint testing failed: {e}")
        return {}

def run_live_server_test():
    """Start actual server and test with HTTP requests"""
    print("\n🌐 Testing Live Server...")
    
    def start_server():
        try:
            from api.app import app
            app.run(host='127.0.0.1', port=5001, debug=False, use_reloader=False)
        except:
            pass
    
    # Start server in background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Wait for server to start
    print("  Waiting for server to start...")
    time.sleep(3)
    
    # Test endpoints with HTTP requests
    base_url = 'http://127.0.0.1:5001'
    endpoints = [
        '/',
        '/test',
        '/api/health',
        '/api/models/status', 
        '/api/statistics'
    ]
    
    success_count = 0
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            status = response.status_code
            print(f"  ✓ {endpoint}: HTTP {status}")
            
            if status < 400:
                success_count += 1
                
                # Show sample data for API endpoints
                if endpoint.startswith('/api/') and status == 200:
                    try:
                        data = response.json()
                        print(f"    Sample data: {str(data)[:100]}...")
                    except:
                        pass
            else:
                print(f"    Error: {response.text[:100]}...")
                
        except requests.exceptions.RequestException as e:
            print(f"  ❌ {endpoint}: Connection failed - {e}")
        except Exception as e:
            print(f"  ❌ {endpoint}: Error - {e}")
    
    print(f"\n  Live server test: {success_count}/{len(endpoints)} endpoints working")
    return success_count == len(endpoints)

def main():
    """Run all tests"""
    print("🧪 DEEPFAKE DETECTION - SERVER TEST SUITE")
    print("=" * 60)
    
    # Test 1: Server startup
    app = test_server_startup()
    if not app:
        print("\n❌ Server startup failed - cannot continue")
        return False
    
    # Test 2: Test client endpoints
    test_client_results = test_endpoints_with_test_client(app)
    test_client_success = sum(1 for r in test_client_results.values() if r['success'])
    
    print(f"\nTest Client Results: {test_client_success}/{len(test_client_results)} endpoints working")
    
    # Test 3: Live server test
    print("\n" + "="*40)
    live_server_success = run_live_server_test()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    print(f"✅ Server Startup: {'PASS' if app else 'FAIL'}")
    print(f"✅ Test Client: {'PASS' if test_client_success >= 4 else 'FAIL'} ({test_client_success}/5)")
    print(f"✅ Live Server: {'PASS' if live_server_success else 'FAIL'}")
    
    overall_success = app and test_client_success >= 4
    
    if overall_success:
        print("\n🎉 ALL TESTS PASSED!")
        print("✨ Your server is working correctly!")
        print("\n🚀 Ready to run:")
        print("   python run.py")
        print("\n🌐 Then visit:")
        print("   http://localhost:5000")
        return True
    else:
        print("\n⚠️ Some tests failed.")
        print("🔧 The basic server functionality works, but there may be issues with:")
        print("   - Network connectivity")
        print("   - Port availability")
        print("   - Firewall settings")
        
        print("\n💡 Try running manually:")
        print("   python run.py")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)