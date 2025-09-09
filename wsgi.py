#!/usr/bin/env python3
"""
WSGI Entry Point for Railway Deployment
Production-ready server configuration
"""

import os
from fixed_server import app

if __name__ == "__main__":
    # Get port from environment (Railway sets this)
    port = int(os.environ.get('PORT', 8000))
    
    # Production settings
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
    
    # Run with gunicorn in production, Flask in development
    if os.environ.get('RAILWAY_ENVIRONMENT_NAME'):
        # Production - let gunicorn handle this
        print(f"Starting production server on port {port}")
    else:
        # Development
        print(f"Starting development server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)