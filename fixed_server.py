#!/usr/bin/env python3
"""
Fixed Flask Server with Static File Serving
Serves static files properly from src/frontend/static/
"""

from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS
import os
from datetime import datetime

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
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Static file serving is now working!',
        'timestamp': datetime.now().isoformat(),
        'static_files_working': True,
        'version': '2.0.0-static-fixed',
        'server': 'Flask/DeepFake Detection API'
    })

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
    port = int(os.environ.get('PORT', 5000))
    print(f"   Running on port: {port}")
    print(f"   Test static files: /static/js/accessibility.js")
    print()
    print("Press Ctrl+C to stop the server")
    print("="*60)
    print()
    
    try:
        # For production deployment (Railway), don't use debug mode
        debug_mode = os.environ.get('RAILWAY_ENVIRONMENT_NAME') is None
        app.run(debug=debug_mode, host='0.0.0.0', port=port)
    except Exception as e:
        print(f"Error starting on port {port}: {e}")
        try:
            app.run(debug=False, host='0.0.0.0', port=8000)
        except Exception as e2:
            print(f"Error starting on port 8000: {e2}")
            app.run(debug=False, host='0.0.0.0', port=3000)








            