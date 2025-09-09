@echo off
echo Starting DeepFake Detection Full Stack Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo ✓ Python found: 
python --version
echo.

REM Start backend in a new window
echo Starting Backend API Server...
start "DeepFake API Backend" cmd /c "cd /d \"%~dp0\" && python src/api/app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Check if frontend dependencies are installed
if not exist "frontend-nextjs\node_modules" (
    echo Installing frontend dependencies...
    cd frontend-nextjs
    npm install
    cd ..
    echo.
)

REM Start frontend in a new window
echo Starting Next.js Frontend...
start "DeepFake Next.js Frontend" cmd /c "cd /d \"%~dp0\frontend-nextjs\" && npm run dev"

echo.
echo ========================================
echo   DeepFake Detection System Started!
echo ========================================
echo.
echo 🚀 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:5000
echo 📊 API Health: http://localhost:5000/api/health
echo.
echo Both services are starting in separate windows.
echo Close those windows to stop the services.
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo Application opened in browser!
echo Keep this window open - close it to view logs or troubleshoot.
pause