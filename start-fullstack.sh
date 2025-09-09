#!/bin/bash

echo "Starting DeepFake Detection Full Stack Application..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ ERROR: Python is not installed or not in PATH"
        echo "Please install Python from https://python.org/"
        exit 1
    fi
    PYTHON_CMD="python"
else
    PYTHON_CMD="python3"
fi

echo "✓ Node.js found: $(node --version)"
echo "✓ Python found: $($PYTHON_CMD --version)"
echo

# Function to cleanup background processes
cleanup() {
    echo
    echo "Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting Backend API Server..."
cd "$(dirname "$0")"
$PYTHON_CMD src/api/app.py &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Check if frontend dependencies are installed
if [ ! -d "frontend-nextjs/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend-nextjs
    npm install
    cd ..
    echo
fi

# Start frontend in background
echo "Starting Next.js Frontend..."
cd frontend-nextjs
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "========================================"
echo "   DeepFake Detection System Started!"
echo "========================================"
echo
echo "🚀 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/api/health"
echo
echo "Both services are running in the background."
echo "Press Ctrl+C to stop all services."
echo

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo "💡 Open http://localhost:3000 in your browser to use the application"
fi

# Wait for background processes
wait