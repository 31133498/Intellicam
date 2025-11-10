from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import base64
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, origins="*")

# Load YOLOv8 model locally
try:
    model = YOLO('yolov8n.pt')
    print("YOLOv8 model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Detect ALL objects - no filtering
DETECTION_THRESHOLD = 0.25

@app.route('/health', methods=['GET'])
def health():
    available_classes = list(model.names.values()) if model else []
    return {
        "status": "Local AI engine running",
        "model_loaded": model is not None,
        "all_classes": available_classes,
        "total_classes": len(available_classes),
        "detection_threshold": DETECTION_THRESHOLD
    }

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get all available YOLO classes"""
    if model:
        return {"classes": list(model.names.values())}
    return {"error": "Model not loaded"}

@app.route('/detect', methods=['POST'])
def detect_objects():
    """Detect objects in base64 image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return {"error": "No image data provided"}, 400
        
        if not model:
            return {"error": "Model not loaded"}, 500
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if 'data:image' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode to numpy array
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return {"error": "Invalid image data"}, 400
                
        except Exception as e:
            return {"error": f"Failed to decode image: {str(e)}"}, 400
        
        # Run YOLO detection
        results = model(frame, conf=DETECTION_THRESHOLD)[0]
        detections = []
        all_objects = []
        
        for r in results.boxes.data.tolist():
            x1, y1, x2, y2, conf, class_id = r
            class_name = model.names[int(class_id)]
            
            # Log all detected objects
            all_objects.append(f"{class_name}({round(conf, 2)})")
            
            # Return all detected objects (not just threats)
            detection = {
                "object": class_name,
                "confidence": round(conf, 2),
                "timestamp": datetime.now().isoformat(),
                "bbox": [int(x1), int(y1), int(x2), int(y2)]
            }
            detections.append(detection)
        
        if all_objects:
            print(f"✅ DETECTED: {', '.join(all_objects)}")
        else:
            print("❌ Nothing detected")
        
        return {
            "success": True,
            "detections": detections,
            "threats_found": len([d for d in detections if d['object'] in {'knife', 'scissors', 'gun'}]),
            "total_objects": len(detections),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Detection error: {e}")
        return {"error": f"Detection failed: {str(e)}"}, 500

if __name__ == '__main__':
    print("Starting Local AI Engine...")
    if model:
        print(f"YOLOv8 classes available: {len(model.names)}")
        all_classes = list(model.names.values())
        print(f"All classes: {', '.join(all_classes)}")
    print(f"Detection threshold: {DETECTION_THRESHOLD}")
    print("AI Engine running on http://localhost:5001")
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)