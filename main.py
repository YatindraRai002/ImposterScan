#!/usr/bin/env python3
"""
Main entry point for Railway deployment
Fallback if wsgi.py doesn't work
"""

import os
from fixed_server import app

if __name__ == "__main__":
    # Get port from environment (Railway sets this)
    port = int(os.environ.get('PORT', 8000))
    
    # Production settings for Railway
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
    
    print(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, threaded=True)