# INTELLICAM AI Engine

## 🚀 Quick Setup

### Install & Run
```bash
pip install -r requirements.txt
python local_ai.py
```
Runs on `http://localhost:8000`

## 🎯 Features
- **YOLOv8 Object Detection** - Real-time threat detection
- **Base64 Image Processing** - Accepts webcam frames
- **REST API** - Simple HTTP endpoints
- **Threat Classification** - Identifies weapons and objects

## 🔧 API Endpoints

### Health Check
```http
GET /health
```

### Object Detection
```http
POST /detect
Content-Type: application/json

{
  "image": "base64_encoded_image",
  "session_id": "demo"
}
```

**Response:**
```json
{
  "detections": [
    {
      "object": "person",
      "confidence": 0.95,
      "timestamp": "2025-01-01T12:00:00Z"
    }
  ],
  "threats_found": 0,
  "total_objects": 1
}
```

## 🛠️ Dependencies
```bash
pip install ultralytics opencv-python flask flask-cors pillow
```

## 🔍 Detected Objects
- **Threats:** knife, gun, scissors
- **General:** person, car, bicycle, etc.
- **Confidence Threshold:** 0.5 minimum

## 📊 Model
Uses YOLOv8n model (`yolov8n.pt`) for fast, accurate detection.