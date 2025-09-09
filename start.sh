#!/bin/bash

echo "========================================"
echo "   DEEPFAKE DETECTION SYSTEM"
echo "========================================"
echo "Starting the enhanced detection system..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Error: Python is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Try python3 first, then python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "Python found, starting server..."
echo

# Run the application
$PYTHON_CMD run.py