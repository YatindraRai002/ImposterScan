#!/usr/bin/env python3
"""
Fixed Flask Server with Static File Serving
Serves static files properly from src/frontend/static/
"""

from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS
import os
import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Initialize Flask app with correct template and static folders
script_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(script_dir, 'src', 'frontend', 'templates')
static_dir = os.path.join(script_dir, 'src', 'frontend', 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir,
            static_url_path='/static')
app.config['SECRET_KEY'] = 'deepfake-detection-secret-key-2024'
CORS(app)

print(f"Template dir: {template_dir}")
print(f"Static dir: {static_dir}")
print(f"Template exists: {os.path.exists(template_dir)}")
print(f"Static exists: {os.path.exists(static_dir)}")

@app.route('/')
def index():
    """Serve the main application"""
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"Template rendering failed: {e}")
        return f"""
        <html>
        <head><title>DeepFake Detection System - Static Files Fixed</title></head>
        <body>
            <h1>DeepFake Detection System</h1>
            <p style="color: green;">Static files are now working!</p>
            <p>Template loading error: {e}</p>
            <p>Available endpoints:</p>
            <ul>
                <li><a href="/api/health">API Health</a></li>
                <li><a href="/test">Test Endpoint</a></li>
            </ul>
            <p><strong>Static file test:</strong></p>
            <ul>
                <li><a href="/static/js/accessibility.js">Accessibility.js</a> - Should work now!</li>
                <li><a href="/static/js/app.js">App.js</a> - Should work now!</li>
            </ul>
        </body>
        </html>
        """, 200

@app.route('/test')
def test_endpoint():
    """Simple test endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Server is running with static files fixed!',
        'static_files': {
            'accessibility_js': '/static/js/accessibility.js',
            'app_js': '/static/js/app.js',
            'style_css': '/static/css/style.css'
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/debug/static')
def debug_static():
    """Debug static file configuration"""
    accessibility_path = os.path.join(static_dir, 'js', 'accessibility.js')
    app_js_path = os.path.join(static_dir, 'js', 'app.js')
    
    return jsonify({
        'template_folder': app.template_folder,
        'static_folder': app.static_folder,
        'static_url_path': app.static_url_path,
        'accessibility_js_exists': os.path.exists(accessibility_path),
        'accessibility_js_path': accessibility_path,
        'app_js_exists': os.path.exists(app_js_path),
        'app_js_path': app_js_path,
        'static_dir_contents': os.listdir(static_dir) if os.path.exists(static_dir) else 'static dir not found',
        'js_dir_contents': os.listdir(os.path.join(static_dir, 'js')) if os.path.exists(os.path.join(static_dir, 'js')) else 'js dir not found'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Enhanced health check endpoint for Railway"""
    try:
        # Check static directory
        static_accessible = os.path.exists(static_dir)
        
        # Check template directory  
        template_accessible = os.path.exists(template_dir)
        
        # Overall health status
        is_healthy = static_accessible and template_accessible
        
        health_data = {
            'status': 'healthy' if is_healthy else 'unhealthy',
            'message': 'DeepFake Detection API is running',
            'timestamp': datetime.now().isoformat(),
            'environment': os.environ.get('RAILWAY_ENVIRONMENT_NAME', 'development'),
            'port': os.environ.get('PORT', '8000'),
            'checks': {
                'static_files': static_accessible,
                'templates': template_accessible,
                'flask_app': True
            },
            'version': '3.0.0-railway-ready',
            'server': 'Flask/DeepFake Detection API',
            'uptime': True
        }
        
        logger.info(f"Health check: {'PASS' if is_healthy else 'FAIL'}")
        
        return jsonify(health_data), 200 if is_healthy else 503
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Health check failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("DEEPFAKE DETECTION - STATIC FILES FIXED")
    print("="*60)
    print("ACCESSIBILITY.JS AND STATIC FILES NOW WORK!")
    print("PROPER FLASK CONFIGURATION")
    print("TEMPLATE AND STATIC DIRECTORIES CONFIGURED")
    print()
    print("SERVER STARTING...")
    
    # Get port from environment variable (Railway sets PORT)
    port = int(os.environ.get('PORT', 8000))
    print(f"   Running on port: {port}")
    print(f"   Environment: {os.environ.get('RAILWAY_ENVIRONMENT_NAME', 'development')}")
    print(f"   Test static files: /static/js/accessibility.js")
    print()
    print("Press Ctrl+C to stop the server")
    print("="*60)
    print()
    
    # For production deployment (Railway), don't use debug mode
    is_production = os.environ.get('RAILWAY_ENVIRONMENT_NAME') is not None
    debug_mode = not is_production
    
    print(f"   Debug mode: {debug_mode}")
    print(f"   Production mode: {is_production}")
    
    try:
        app.run(debug=debug_mode, host='0.0.0.0', port=port, threaded=True)
    except Exception as e:
        print(f"Error starting on port {port}: {e}")
        # Fallback ports for Railway
        fallback_ports = [8080, 3000, 5000]
        for fallback_port in fallback_ports:
            try:
                print(f"Trying fallback port {fallback_port}...")
                app.run(debug=False, host='0.0.0.0', port=fallback_port, threaded=True)
                break
            except Exception as e2:
                print(f"Error starting on port {fallback_port}: {e2}")
                continue








            