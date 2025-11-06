from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import threading
import time
from datetime import datetime
import requests
from config import DETECTION_THRESHOLD, TARGET_CLASSES, BACKEND_URL

app = Flask(__name__)
model = YOLO('yolov8n.pt')
active_streams = {}

def process_stream(stream_url, stream_id):
    """Process camera stream and send detections to backend"""
    cap = cv2.VideoCapture(stream_url)
    last_process_time = time.time()
    
    while stream_id in active_streams:
        ret, frame = cap.read()
        if not ret:
            break
            
        current_time = time.time()
        if current_time - last_process_time < 1:  # 1 FPS
            continue
        last_process_time = current_time
        
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
                
                # Send to backend
                try:
                    requests.post(BACKEND_URL, json=detection, timeout=3)
                except:
                    pass
    
    cap.release()

@app.route('/start_detection', methods=['POST'])
def start_detection():
    """Start detection on IP camera stream"""
    data = request.json
    stream_url = data.get('stream_url')
    stream_id = data.get('stream_id', 'default')
    
    if stream_id in active_streams:
        return jsonify({"error": "Stream already active"}), 400
    
    active_streams[stream_id] = True
    thread = threading.Thread(target=process_stream, args=(stream_url, stream_id))
    thread.start()
    
    return jsonify({"status": "detection_started", "stream_id": stream_id})

@app.route('/stop_detection', methods=['POST'])
def stop_detection():
    """Stop detection on stream"""
    data = request.json
    stream_id = data.get('stream_id', 'default')
    
    if stream_id in active_streams:
        del active_streams[stream_id]
        return jsonify({"status": "detection_stopped"})
    
    return jsonify({"error": "Stream not found"}), 404

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI engine running", "active_streams": len(active_streams)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)