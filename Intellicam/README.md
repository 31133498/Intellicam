# Intellicam – Smart Predictive Surveillance
**"Your Camera Just Got Intelligent"**

## 🚀 Project Overview
Real-time AI surveillance system that transforms phone cameras into intelligent threat detection tools using YOLOv8 + OpenCV.

## 📁 Current Implementation Status

### ✅ AI Engine (Complete)
- **Location**: `ai_engine/`
- **Features**:
  - YOLOv8 object detection
  - Real-time camera stream processing (IP cam + webcam)
  - Configurable detection thresholds
  - Frame saving with bounding boxes
  - Backend API integration
  - Motion detection
  - Comprehensive logging

### 🔄 Pending Components (For Backend Team)
- **Backend API** (`backend/`) - Flask/FastAPI server
- **Frontend Dashboard** (`frontend/`) - React visualization
- **Database Integration** - SQLite/Firebase
- **Twilio Messaging** - WhatsApp/SMS alerts

## 🛠️ AI Engine Usage

### Installation
```bash
cd ai_engine
pip install -r requirements.txt
```

### Run with Webcam
```bash
python inference.py --source 0
```

### Run with IP Camera
```bash
python inference.py --source "http://192.168.x.x:8080/video"
```

### Quick Test
```bash
python run_once.py
```

## 📊 Detection Output Format
```json
{
  "object": "person",
  "confidence": 0.91,
  "timestamp": "2025-11-03T10:20:30",
  "frame_id": "frame_20251103_102030.jpg"
}
```

## ⚙️ Configuration
Edit `config.py` to customize:
- Detection threshold
- Target object classes
- Backend URL
- Frame processing rate

## 🔗 Integration Ready
AI engine sends POST requests to `http://localhost:5000/api/alert` - backend team can implement this endpoint to receive detections.

## 📝 Next Development Phase
1. Backend API development
2. Database schema implementation
3. Twilio integration
4. Frontend dashboard
5. Full system integration testing