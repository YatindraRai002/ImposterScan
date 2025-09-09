#!/usr/bin/env python3
"""
WSGI Entry Point for Railway Deployment
Production-ready server configuration
"""

import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from fixed_server import app
    logger.info("Successfully imported Flask app from fixed_server")
except ImportError as e:
    logger.error(f"Failed to import Flask app: {e}")
    sys.exit(1)

# Configure for production
app.config['DEBUG'] = False
app.config['TESTING'] = False

# Export app for gunicorn
application = app

if __name__ == "__main__":
    # Get port from environment (Railway sets this)
    port = int(os.environ.get('PORT', 8000))
    
    # Run with gunicorn in production, Flask in development
    if os.environ.get('RAILWAY_ENVIRONMENT_NAME'):
        # Production - let gunicorn handle this
        logger.info(f"Starting production server on port {port}")
    else:
        # Development
        logger.info(f"Starting development server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=True)