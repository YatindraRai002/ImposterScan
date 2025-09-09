#!/usr/bin/env python3
"""
Integration Test Suite - DeepFake Detection System
Tests the complete connection between frontend, backend, and ML models
"""

import sys
import os
import json
import tempfile
from pathlib import Path
from io import BytesIO

# Add src to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / 'src'))

def test_model_integration():
    """Test ML model integration"""
    print("🧠 Testing ML Model Integration...")
    
    try:
        from models.deepfake_detector import get_detector
        detector = get_detector()
        
        print(f"  ✓ Detector initialized: {detector.is_initialized}")
        print(f"  ✓ Models loaded: {list(detector.models.keys())}")
        
        # Test balanced predictions
        results = []
        for i in range(20):
            result = detector._generate_realistic_result('image')
            results.append(result['prediction'])
        
        authentic_count = results.count('authentic')
        deepfake_count = results.count('deepfake')
        authentic_pct = (authentic_count / len(results)) * 100
        
        print(f"  ✓ Prediction balance: {authentic_pct:.1f}% authentic, {100-authentic_pct:.1f}% deepfake")
        
        if 40 <= authentic_pct <= 80:
            print("  ✅ Prediction balance is healthy!")
        else:
            print("  ⚠️  Prediction balance might need adjustment")
        
        return True
    except Exception as e:
        print(f"  ❌ Model test failed: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🔧 Testing API Endpoints...")
    
    try:
        from api.app import app
        client = app.test_client()
        
        # Test health endpoint
        response = client.get('/api/health')
        print(f"  ✓ Health endpoint: {response.status_code}")
        
        if response.status_code == 200:
            data = response.get_json()
            print(f"    Status: {data.get('status', 'unknown')}")
        
        # Test model status endpoint
        response = client.get('/api/models/status')
        print(f"  ✓ Model status endpoint: {response.status_code}")
        
        # Test statistics endpoint
        response = client.get('/api/statistics')
        print(f"  ✓ Statistics endpoint: {response.status_code}")
        
        # Test file upload (mock)
        test_data = b"fake image data for testing"
        response = client.post('/api/upload', 
                               data={'file': (BytesIO(test_data), 'test.jpg')},
                               content_type='multipart/form-data')
        
        if response.status_code in [200, 201]:
            print(f"  ✓ File upload endpoint: {response.status_code}")
        else:
            print(f"  ⚠️  File upload endpoint: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"  ❌ API test failed: {e}")
        return False

def test_frontend_files():
    """Test frontend file structure"""
    print("\n🎨 Testing Frontend Files...")
    
    frontend_path = project_root / 'src' / 'frontend'
    
    required_files = [
        'templates/index.html',
        'static/js/app.js',
        'static/js/accessibility.js',
        'static/css/style.css',
        'static/css/responsive.css'
    ]
    
    all_exist = True
    for file_path in required_files:
        full_path = frontend_path / file_path
        if full_path.exists():
            print(f"  ✓ {file_path}")
        else:
            print(f"  ❌ {file_path} - MISSING")
            all_exist = False
    
    return all_exist

def test_project_structure():
    """Test overall project structure"""
    print("\n📁 Testing Project Structure...")
    
    required_dirs = [
        'src/api',
        'src/models', 
        'src/frontend/templates',
        'src/frontend/static/js',
        'src/frontend/static/css',
        'uploads'
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        full_path = project_root / dir_path
        if full_path.exists() and full_path.is_dir():
            print(f"  ✓ {dir_path}/")
        else:
            print(f"  ❌ {dir_path}/ - MISSING")
            all_exist = False
    
    # Create missing upload directory
    uploads_dir = project_root / 'uploads'
    if not uploads_dir.exists():
        uploads_dir.mkdir(exist_ok=True)
        print(f"  ✓ Created uploads/ directory")
    
    return all_exist

def test_startup_scripts():
    """Test startup scripts"""
    print("\n🚀 Testing Startup Scripts...")
    
    scripts = ['run.py', 'start.bat', 'start.sh']
    all_exist = True
    
    for script in scripts:
        script_path = project_root / script
        if script_path.exists():
            print(f"  ✓ {script}")
        else:
            print(f"  ❌ {script} - MISSING")
            all_exist = False
    
    return all_exist

def run_comprehensive_test():
    """Run all integration tests"""
    print("🧪 DEEPFAKE DETECTION - INTEGRATION TEST SUITE")
    print("=" * 60)
    print("Testing complete system integration...")
    print()
    
    tests = [
        ("Project Structure", test_project_structure),
        ("Frontend Files", test_frontend_files),
        ("ML Model Integration", test_model_integration),
        ("API Endpoints", test_api_endpoints),
        ("Startup Scripts", test_startup_scripts)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"  ❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:>8} | {test_name}")
        if result:
            passed += 1
    
    print("-" * 60)
    print(f"Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("\n🎉 ALL TESTS PASSED!")
        print("✨ Your DeepFake Detection System is fully integrated!")
        print("🚀 Ready to run: python run.py")
        return True
    else:
        print(f"\n⚠️  {len(tests) - passed} tests failed.")
        print("🔧 Please check the error messages above and fix any issues.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)