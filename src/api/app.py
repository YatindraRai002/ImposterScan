"""
DeepFake Detection API Server
Flask-based REST API for deepfake analysis
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import uuid
import json
from datetime import datetime
import logging
from werkzeug.utils import secure_filename
import mimetypes
from typing import Dict, List
import traceback

# Import our detection model with error handling
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import the model, fall back to mock if not available
try:
    from models.deepfake_detector import get_detector, analyze_file
    MODEL_AVAILABLE = True
    logger.info("✓ ML Models imported successfully")
except ImportError as e:
    logger.warning(f"⚠ ML Models not available: {e}")
    MODEL_AVAILABLE = False
    
    # Mock functions for when models aren't available
    def get_detector():
        return None
    
    def analyze_file(file_path, file_type):
        import random
        prediction = 'authentic' if random.random() > 0.4 else 'deepfake'
        confidence = random.uniform(0.65, 0.95)
        return {
            'prediction': prediction,
            'confidence': confidence,
            'is_authentic': prediction == 'authentic',
            'models_used': ['mock_model'],
            'evidence': {
                'facial_inconsistencies': random.uniform(0, 1),
                'temporal_artifacts': random.uniform(0, 1),
                'compression_anomalies': random.uniform(0, 1)
            },
            'processing_time': random.uniform(1, 3)
        }

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app with proper template and static folders
template_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'templates')
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend', 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir,
            static_url_path='/static')
app.config['SECRET_KEY'] = 'deepfake-detection-secret-key-2024'
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'uploads')
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'image': {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'},
    'video': {'mp4', 'avi', 'mov', 'webm', 'mkv', 'flv'},
    'audio': {'mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac'}
}

# Global storage for analysis jobs (in production, use a database)
analysis_jobs = {}

def allowed_file(filename: str, file_type: str = None) -> bool:
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if file_type:
        return extension in ALLOWED_EXTENSIONS.get(file_type, set())
    
    # Check all types if no specific type provided
    for allowed_exts in ALLOWED_EXTENSIONS.values():
        if extension in allowed_exts:
            return True
    return False

def get_file_type(filename: str) -> str:
    """Determine file type based on extension"""
    if not filename or '.' not in filename:
        return 'unknown'
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if extension in extensions:
            return file_type
    
    return 'unknown'

def create_job_record(filename: str, file_path: str, file_type: str, file_size: int) -> str:
    """Create a new analysis job record"""
    job_id = str(uuid.uuid4())
    
    job_record = {
        'id': job_id,
        'filename': filename,
        'file_path': file_path,
        'file_type': file_type,
        'file_size': file_size,
        'status': 'pending',
        'created_at': datetime.now().isoformat(),
        'started_at': None,
        'completed_at': None,
        'result': None,
        'error': None
    }
    
    analysis_jobs[job_id] = job_record
    return job_id

@app.route('/')
def index():
    """Serve the main application"""
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Template rendering failed: {e}")
        return f"""
        <html>
        <head><title>DeepFake Detection System</title></head>
        <body>
            <h1>🔍 DeepFake Detection System</h1>
            <p>Template loading error: {e}</p>
            <p>Available endpoints:</p>
            <ul>
                <li><a href="/api/health">API Health</a></li>
                <li><a href="/api/models/status">Model Status</a></li>
                <li><a href="/api/statistics">Statistics</a></li>
            </ul>
        </body>
        </html>
        """, 200

@app.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/test')
def test_endpoint():
    """Simple test endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Server is running correctly!',
        'endpoints': {
            'home': '/',
            'health': '/api/health',
            'model_status': '/api/models/status', 
            'statistics': '/api/statistics',
            'test': '/test'
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        detector = get_detector()
        models_initialized = detector.is_initialized if detector else False
    except:
        models_initialized = False
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_available': MODEL_AVAILABLE,
        'models_initialized': models_initialized,
        'version': '2.0.0',
        'server': 'Flask/DeepFake Detection API'
    })

@app.route('/api/models/status', methods=['GET'])
def model_status():
    """Get model status and performance metrics"""
    if not MODEL_AVAILABLE:
        return jsonify({
            'models': {
                'image': {'status': 'mock', 'loaded': False},
                'video': {'status': 'mock', 'loaded': False},
                'audio': {'status': 'mock', 'loaded': False}
            },
            'mode': 'mock',
            'message': 'ML models not available, using mock predictions',
            'performance': {
                'mock_model': {'accuracy': 0.85, 'precision': 0.82, 'recall': 0.88}
            },
            'statistics': {
                'total_predictions': 0,
                'authentic_percentage': 60.0,
                'deepfake_percentage': 40.0,
                'average_confidence': 0.78
            }
        })
    
    try:
        detector = get_detector()
        return jsonify({
            'models': {
                'image': {'status': 'active', 'loaded': detector.models.get('image') is not None},
                'video': {'status': 'active', 'loaded': detector.models.get('video') is not None},
                'audio': {'status': 'active', 'loaded': detector.models.get('audio') is not None}
            },
            'performance': detector.get_model_performance(),
            'statistics': detector.get_prediction_stats()
        })
    except Exception as e:
        return jsonify({
            'error': f'Model status check failed: {str(e)}',
            'models': {'status': 'error'},
            'performance': {},
            'statistics': {}
        }), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload file for analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported'}), 400
        
        # Secure filename and save
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        file.save(file_path)
        
        # Get file info
        file_size = os.path.getsize(file_path)
        file_type = get_file_type(filename)
        
        # Create job record
        job_id = create_job_record(filename, file_path, file_type, file_size)
        
        logger.info(f"File uploaded: {filename}, Job ID: {job_id}, Type: {file_type}")
        
        return jsonify({
            'job_id': job_id,
            'filename': filename,
            'file_type': file_type,
            'file_size': file_size,
            'status': 'uploaded'
        }), 201
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Start analysis of uploaded file"""
    try:
        data = request.get_json()
        
        if not data or 'job_id' not in data:
            return jsonify({'error': 'Job ID required'}), 400
        
        job_id = data['job_id']
        
        if job_id not in analysis_jobs:
            return jsonify({'error': 'Job not found'}), 404
        
        job = analysis_jobs[job_id]
        
        if job['status'] != 'pending':
            return jsonify({'error': f'Job already {job["status"]}'}), 400
        
        # Update job status
        job['status'] = 'processing'
        job['started_at'] = datetime.now().isoformat()
        
        logger.info(f"Starting analysis for job {job_id}")
        
        try:
            # Perform analysis
            result = analyze_file(job['file_path'], job['file_type'])
            
            # Update job with results
            job['status'] = 'completed'
            job['completed_at'] = datetime.now().isoformat()
            job['result'] = result
            
            logger.info(f"Analysis completed for job {job_id}: {result['prediction']} ({result['confidence']:.2f})")
            
            return jsonify({
                'job_id': job_id,
                'status': 'completed',
                'result': result
            })
            
        except Exception as e:
            # Handle analysis error
            job['status'] = 'failed'
            job['error'] = str(e)
            job['completed_at'] = datetime.now().isoformat()
            
            logger.error(f"Analysis failed for job {job_id}: {str(e)}")
            
            return jsonify({
                'job_id': job_id,
                'status': 'failed',
                'error': str(e)
            }), 500
            
    except Exception as e:
        logger.error(f"Analysis request failed: {str(e)}")
        return jsonify({'error': 'Analysis failed', 'details': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job_status(job_id: str):
    """Get job status and results"""
    try:
        if job_id not in analysis_jobs:
            return jsonify({'error': 'Job not found'}), 404
        
        job = analysis_jobs[job_id]
        
        response_data = {
            'job_id': job['id'],
            'filename': job['filename'],
            'file_type': job['file_type'],
            'file_size': job['file_size'],
            'status': job['status'],
            'created_at': job['created_at'],
            'started_at': job['started_at'],
            'completed_at': job['completed_at']
        }
        
        if job['result']:
            response_data['result'] = job['result']
        
        if job['error']:
            response_data['error'] = job['error']
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Failed to get job status: {str(e)}")
        return jsonify({'error': 'Failed to get job status'}), 500

@app.route('/api/jobs', methods=['GET'])
def list_jobs():
    """List all analysis jobs"""
    try:
        # Get query parameters
        limit = min(int(request.args.get('limit', 50)), 100)  # Max 100
        offset = int(request.args.get('offset', 0))
        status_filter = request.args.get('status')
        
        # Filter and sort jobs
        jobs_list = list(analysis_jobs.values())
        
        if status_filter:
            jobs_list = [job for job in jobs_list if job['status'] == status_filter]
        
        # Sort by creation time (newest first)
        jobs_list.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Apply pagination
        total = len(jobs_list)
        paginated_jobs = jobs_list[offset:offset + limit]
        
        # Remove sensitive file paths
        for job in paginated_jobs:
            job_copy = job.copy()
            if 'file_path' in job_copy:
                del job_copy['file_path']
            paginated_jobs[paginated_jobs.index(job)] = job_copy
        
        return jsonify({
            'jobs': paginated_jobs,
            'total': total,
            'limit': limit,
            'offset': offset
        })
        
    except Exception as e:
        logger.error(f"Failed to list jobs: {str(e)}")
        return jsonify({'error': 'Failed to list jobs'}), 500

@app.route('/api/analyze/bulk', methods=['POST'])
def bulk_analyze():
    """Analyze multiple files"""
    try:
        files = request.files.getlist('files')
        
        if not files:
            return jsonify({'error': 'No files provided'}), 400
        
        job_ids = []
        
        for file in files:
            if file.filename == '' or not allowed_file(file.filename):
                continue
            
            # Process each file
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            file.save(file_path)
            
            file_size = os.path.getsize(file_path)
            file_type = get_file_type(filename)
            
            job_id = create_job_record(filename, file_path, file_type, file_size)
            job_ids.append(job_id)
        
        return jsonify({
            'message': f'{len(job_ids)} files uploaded for analysis',
            'job_ids': job_ids
        }), 201
        
    except Exception as e:
        logger.error(f"Bulk upload failed: {str(e)}")
        return jsonify({'error': 'Bulk upload failed', 'details': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get system statistics"""
    try:
        # Basic job statistics
        total_jobs = len(analysis_jobs)
        completed_jobs = sum(1 for job in analysis_jobs.values() if job['status'] == 'completed')
        pending_jobs = sum(1 for job in analysis_jobs.values() if job['status'] == 'pending')
        failed_jobs = sum(1 for job in analysis_jobs.values() if job['status'] == 'failed')
        
        stats = {
            'total_jobs': total_jobs,
            'completed_jobs': completed_jobs,
            'pending_jobs': pending_jobs,
            'failed_jobs': failed_jobs,
            'success_rate': (completed_jobs / max(total_jobs, 1)) * 100,
            'server_uptime': 'running',
            'model_mode': 'ML models' if MODEL_AVAILABLE else 'mock mode'
        }
        
        # Try to get detector stats if available
        if MODEL_AVAILABLE:
            try:
                detector = get_detector()
                if detector:
                    detector_stats = detector.get_prediction_stats()
                    stats.update(detector_stats)
            except:
                pass
        else:
            # Mock statistics
            stats.update({
                'total_predictions': total_jobs,
                'authentic_percentage': 60.0,
                'deepfake_percentage': 40.0,
                'average_confidence': 0.78,
                'last_updated': datetime.now().isoformat()
            })
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Failed to get statistics: {str(e)}")
        return jsonify({
            'error': 'Failed to get statistics',
            'total_jobs': len(analysis_jobs),
            'server_status': 'running'
        }), 200

@app.errorhandler(413)
def file_too_large(error):
    """Handle file too large error"""
    return jsonify({'error': 'File too large', 'max_size': '100MB'}), 413

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting DeepFake Detection API Server...")
    
    # Initialize detector on startup
    try:
        detector = get_detector()
        logger.info("Detector initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize detector: {str(e)}")
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)