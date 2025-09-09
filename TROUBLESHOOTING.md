# 🔧 DeepFake Detection System - Troubleshooting Guide

## 🚨 "Site Cannot Be Reached" Error

If you're getting "site cannot be reached" when trying to access http://localhost:5000, follow these steps:

### Step 1: Test Server Functionality
```bash
python test_server.py
```

This will tell you if the server components are working correctly.

### Step 2: Check if Python is Working
```bash
python --version
```
Should show Python 3.8 or higher.

### Step 3: Check Port Availability
```bash
# Windows
netstat -an | findstr :5000

# Mac/Linux
lsof -i :5000
```

If port 5000 is already in use, try a different port:
```bash
# Edit run.py and change the port
# app.run(host='0.0.0.0', port=5001, debug=False)
```

### Step 4: Test Individual Components

#### Test 1: Basic Flask App
```bash
cd src/api
python -c "from app import app; print('Flask app loads successfully')"
```

#### Test 2: Template Loading
```bash
python -c "import os; print('Template dir:', os.path.exists('src/frontend/templates/index.html'))"
```

#### Test 3: Direct Flask Run
```bash
cd src/api
python -c "from app import app; app.run(port=5001, debug=True)"
```

Then try: http://localhost:5001

### Step 5: Firewall/Antivirus Check

1. **Windows Defender**: Make sure Python is allowed through Windows Firewall
2. **Antivirus**: Temporarily disable antivirus to test
3. **Corporate Network**: Check if port 5000 is blocked

### Step 6: Alternative Access Methods

Try these alternative URLs:
- http://127.0.0.1:5000
- http://127.0.0.1:5000/test
- http://127.0.0.1:5000/api/health

### Step 7: Network Interface Issues

If localhost doesn't work, try running with specific IP:
```python
# In run.py, change:
app.run(host='127.0.0.1', port=5000, debug=False)
```

## 🛠️ Common Issues & Solutions

### Issue: ModuleNotFoundError
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: Permission Denied
```
PermissionError: [Errno 13] Permission denied
```
**Solution:**
1. Run as administrator (Windows)
2. Change port to 8080 or 8000
3. Check folder permissions

### Issue: Template Not Found
```
TemplateNotFound: index.html
```
**Solution:**
```bash
# Check if template exists
ls src/frontend/templates/index.html

# If missing, the file structure might be wrong
```

### Issue: Import Errors
```
ImportError: attempted relative import with no known parent package
```
**Solution:**
Run from the project root directory:
```bash
# Make sure you're in the right directory
cd /path/to/Deep-Fake-Fraud-Detection
python run.py
```

## 🔍 Debug Mode

To get more detailed error information, edit `run.py`:
```python
# Change debug=False to debug=True
app.run(host='0.0.0.0', port=5000, debug=True)
```

## 📋 System Requirements Check

### Python Version
```bash
python --version
# Should be 3.8 or higher
```

### Required Packages
```bash
pip list | findstr -i "flask"
# Should show Flask and related packages
```

### Directory Structure
```
Deep-Fake-Fraud-Detection/
├── src/
│   ├── api/
│   │   └── app.py
│   ├── models/
│   │   └── deepfake_detector.py
│   └── frontend/
│       ├── templates/
│       │   └── index.html
│       └── static/
│           ├── js/
│           └── css/
├── uploads/
├── run.py
├── test_server.py
└── requirements.txt
```

## 🆘 Emergency Fixes

### Quick Fix 1: Minimal Server
Create `minimal_server.py`:
```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>DeepFake Detection System</h1><p>Server is working!</p>'

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'API is working'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

Run with: `python minimal_server.py`

### Quick Fix 2: Alternative Port
```bash
# Try different ports
python -c "from src.api.app import app; app.run(port=8000)"
python -c "from src.api.app import app; app.run(port=8080)"
python -c "from src.api.app import app; app.run(port=3000)"
```

## 📞 Getting Help

If none of these solutions work:

1. **Check the error logs** - Look at the console output carefully
2. **Test with minimal setup** - Use the minimal_server.py above
3. **Check system compatibility** - Ensure Python 3.8+, Windows 10+/macOS/Linux
4. **Network debugging** - Try `telnet localhost 5000` to test port connectivity

## ✅ Success Indicators

You know it's working when you see:
```
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5000
* Running on http://[::]:5000
```

And these URLs work:
- ✅ http://localhost:5000 (shows the web interface)  
- ✅ http://localhost:5000/api/health (returns JSON)
- ✅ http://localhost:5000/api/models/status (returns model info)
- ✅ http://localhost:5000/api/statistics (returns stats)

## 🚀 Once It's Working

After you see the server running successfully:
1. Open http://localhost:5000 in your browser
2. Test the API endpoints
3. Upload a test image to verify the enhanced balanced predictions
4. Check the statistics to confirm the bias fix is working

The system now provides **realistic 60% authentic / 40% deepfake predictions** instead of the old biased behavior!