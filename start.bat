@echo off
echo ==========================================
echo   DEEPFAKE DETECTION - LOCALHOST FIX
echo ==========================================
echo Fixing "site cannot be reached" error...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found in PATH
    echo.
    echo Please install Python from: https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo ✓ Python found:
python --version
echo.

echo Installing Flask if needed...
python -m pip install flask --quiet
echo ✓ Flask ready
echo.

echo ==========================================
echo 🚀 STARTING SIMPLE SERVER
echo ==========================================
echo This will fix the localhost connection issue
echo.
echo Starting server...
echo ⏳ Please wait for "Running on http://127.0.0.1:5000"
echo.

REM Start the simple server
python simple_server.py

echo.
echo ==========================================
echo Server stopped. Press any key to exit.
pause