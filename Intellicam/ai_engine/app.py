from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from ultralytics import YOLO
import cv2
import threading
import time
from datetime import datetime
import requests
import os
from config import DETECTION_THRESHOLD, TARGET_CLASSES, BACKEND_URL

app = Flask(__name__)
api = Api(app, version='1.0', title='Intellicam AI Engine API',
          description='YOLOv8 Object Detection API for Smart Surveillance')

# Load model
model = YOLO('yolov8n.pt')
active_streams = {}

# API Models for Swagger
start_detection_model = api.model('StartDetection', {
    'stream_url': fields.String(required=True, description='IP camera stream URL', example='http://10.172.201.200:8080/video'),
    'stream_id': fields.String(required=False, description='Unique stream identifier', example='camera_1')
})

stop_detection_model = api.model('StopDetection', {
    'stream_id': fields.String(required=True, description='Stream ID to stop', example='camera_1')
})

detection_response = api.model('DetectionResponse', {
    'object': fields.String(description='Detected object name'),
    'confidence': fields.Float(description='Detection confidence score'),
    'timestamp': fields.String(description='Detection timestamp'),
    'stream_id': fields.String(description='Stream identifier')
})

def process_stream(stream_url, stream_id):
    """Process camera stream and send detections to backend"""
    cap = cv2.VideoCapture(stream_url)
    last_process_time = time.time()
    
    while stream_id in active_streams:
        ret, frame = cap.read()
        if not ret:
            print(f"Failed to read frame from {stream_id}")
            time.sleep(1)
            continue
            
        current_time = time.time()
        if current_time - last_process_time < 1:  # 1 FPS
            continue
        last_process_time = current_time
        
        try:
            # Run detection
            results = model(frame, conf=DETECTION_THRESHOLD)[0]
            
            for r in results.boxes.data.tolist():
                x1, y1, x2, y2, conf, class_id = r
                class_name = model.names[int(class_id)]
                
                if class_name in TARGET_CLASSES:
                    detection = {
                        "object": class_name,
                        "confidence": round(conf, 2),
                        "timestamp": datetime.now().isoformat(),
                        "stream_id": stream_id
                    }
                    
                    print(f"Detection: {detection}")
                    
                    # Send to backend if URL is configured
                    if BACKEND_URL and BACKEND_URL != "http://localhost:5000/api/alert":
                        try:
                            requests.post(BACKEND_URL, json=detection, timeout=3)
                        except Exception as e:
                            print(f"Failed to send alert: {e}")
        except Exception as e:
            print(f"Detection error: {e}")
    
    cap.release()
    print(f"Stream {stream_id} stopped")

@api.route('/start_detection')
class StartDetection(Resource):
    @api.expect(start_detection_model)
    @api.doc('start_detection')
    def post(self):
        """Start object detection on IP camera stream"""
        data = request.json
        stream_url = data.get('stream_url')
        stream_id = data.get('stream_id', f'stream_{int(time.time())}')
        
        if not stream_url:
            return {"error": "stream_url is required"}, 400
        
        if stream_id in active_streams:
            return {"error": "Stream already active", "stream_id": stream_id}, 400
        
        active_streams[stream_id] = True
        thread = threading.Thread(target=process_stream, args=(stream_url, stream_id))
        thread.daemon = True
        thread.start()
        
        return {
            "status": "detection_started", 
            "stream_id": stream_id,
            "stream_url": stream_url,
            "target_classes": list(TARGET_CLASSES)
        }

@api.route('/stop_detection')
class StopDetection(Resource):
    @api.expect(stop_detection_model)
    @api.doc('stop_detection')
    def post(self):
        """Stop object detection on stream"""
        data = request.json
        stream_id = data.get('stream_id')
        
        if not stream_id:
            return {"error": "stream_id is required"}, 400
        
        if stream_id in active_streams:
            del active_streams[stream_id]
            return {"status": "detection_stopped", "stream_id": stream_id}
        
        return {"error": "Stream not found"}, 404

@api.route('/health')
class Health(Resource):
    @api.doc('health_check')
    def get(self):
        """Health check endpoint"""
        return {
            "status": "AI engine running",
            "active_streams": len(active_streams),
            "stream_ids": list(active_streams.keys()),
            "model_loaded": True,
            "target_classes": list(TARGET_CLASSES)
        }

@api.route('/streams')
class ActiveStreams(Resource):
    @api.doc('get_active_streams')
    def get(self):
        """Get list of active streams"""
        return {
            "active_streams": len(active_streams),
            "stream_ids": list(active_streams.keys())
        }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)