# INTELLICAM - Local Development Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/31133498/intellicam.git
cd intellicam
```

### 2. Setup AI Engine (Terminal 1)
```bash
cd Intellicam/ai_engine
pip install -r requirements.txt
python local_ai.py
```
**AI Engine runs on:** `http://localhost:8000`

### 3. Setup Frontend (Terminal 2)
```bash
cd frontend_local
npm install
npm start
```
**Frontend runs on:** `http://localhost:3000`

### 4. Configure AI Copilot (Optional)
Create `frontend_local/.env`:
```
REACT_APP_GROQ_API_KEY=your-groq-api-key-here
```

## 🎯 Testing the System

1. **Open Browser:** `http://localhost:3000`
2. **Login:** Use any email/password (localStorage auth)
3. **Start Detection:** 
   - Go to Dashboard
   - Select "Use Webcam" in camera input
   - Click "Start Monitoring"
4. **Test AI Copilot:** Click "AI Copilot" button in header

## 📁 Project Structure
```
intellicam/
├── frontend_local/          # Professional React Frontend (PORT 3000)
├── Intellicam/ai_engine/    # AI Detection Service (PORT 8000)
├── backend/                 # Original Backend (Optional)
└── frontend/                # Original Frontend (Optional)
```

## 🔧 Key Features
- **Professional Security UI** - Dark blue theme, responsive design
- **Real-time AI Detection** - YOLOv8 object detection via webcam
- **AI Security Copilot** - Intelligent assistant for security analysis
- **Alert System** - Sound alerts for threat detection
- **Detection History** - Local storage of security events

## 🛠️ Troubleshooting

**AI Engine Issues:**
```bash
# Install dependencies
pip install ultralytics opencv-python flask flask-cors pillow

# Test AI engine
curl http://localhost:8000/health
```

**Frontend Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**Webcam Access:**
- Allow camera permissions in browser
- Use HTTPS for production deployment

## 🚨 Security Notes
- Never commit API keys to repository
- Use environment variables for sensitive data
- AI Copilot requires Groq API key for full functionality

## 📞 Support
Contact: Shazily (AI Engineer) for technical issues