# INTELLICAM Setup Guide

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/31133498/Intellicam.git
cd Intellicam
```

### 2. Frontend Setup
```bash
cd frontend_local
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Groq API key:
# REACT_APP_GROQ_API_KEY=your_groq_api_key_here

npm start
```

### 3. AI Engine Setup
```bash
cd ../Intellicam/ai_engine
pip install -r requirements.txt
python local_ai.py
```

### 4. Demo Images (Optional)
Place threat detection demo images in:
```
frontend_local/public/threat-images/
├── knife1.jpg
├── knife2.jpg
└── knife3.jpg
```

## Project Structure
```
Intellicam/
├── frontend_local/              # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── AlertPopup.js    # Prominent alert popups
│   │   │   └── Chatbot.js       # AI chatbot
│   │   ├── pages/
│   │   │   ├── Settings.js      # Settings & threat history
│   │   │   └── AICopilot.js     # AI assistant page
│   │   ├── services/
│   │   │   └── aiCopilotService.js # Groq AI integration
│   │   └── hooks/
│   │       └── useAlertSound.js # Alert sound management
│   └── public/
│       ├── AlertSound.mp3       # Alert sound file
│       └── threat-images/       # Demo threat images
├── Intellicam/ai_engine/        # AI Detection Engine (Port 8000)
└── README.md
```

## Features

### Core Security Features
- **Real-time AI object detection** (YOLOv8)
- **Prominent alert popups** for all detections
- **Alert sound system** with user controls
- **Threat history** with image snapshots
- **Camera management** system

### AI Features
- **AI Copilot** with Groq integration
- **Intelligent chatbot** with security analysis
- **Fallback responses** when API unavailable

### UI/UX Features
- **Professional security design** (clean slate theme)
- **Consistent design system** across all pages
- **Responsive layout** for all devices
- **Settings page** with full configuration

## Tech Stack
- **Frontend**: React, Tailwind CSS, React Router
- **AI Engine**: Python, YOLOv8, OpenCV, Flask
- **AI Integration**: Groq API (Llama 3.3 70B)
- **Authentication**: Local storage simulation
- **Styling**: Custom CSS with Tailwind utilities

## API Configuration

### Groq AI Setup
1. Get API key from https://console.groq.com/keys
2. Add to `.env` file:
   ```
   REACT_APP_GROQ_API_KEY=gsk_your_actual_api_key_here
   ```
3. Restart React app after adding API key

## Development Workflow

### Running the Application
1. **Start AI Engine**: `python local_ai.py` (Port 8000)
2. **Start Frontend**: `npm start` (Port 3000)
3. **Access Dashboard**: http://localhost:3000

### Key Development Notes
- **Alert System**: Popups auto-dismiss after 8 seconds
- **Sound Control**: Alerts stop when monitoring stops
- **Image Processing**: Uses base64 for local development
- **Design System**: All components use consistent slate theme
- **AI Responses**: Fallback system works without API key

### Testing Features
1. **Camera Input**: Use any IP camera URL or local video
2. **AI Detection**: Upload images via Test AI page
3. **Alert System**: Detections trigger popups and sounds
4. **Settings**: Manage cameras and view threat history
5. **AI Copilot**: Chat with security AI assistant

## Deployment Notes
- Frontend builds successfully with `npm run build`
- All ESLint warnings resolved
- Environment variables properly configured
- Assets optimized for production

## Troubleshooting

### Common Issues
1. **API Key Issues**: Check .env file and restart app
2. **Sound Not Playing**: Check browser audio permissions
3. **Images Not Loading**: Verify file paths in threat-images folder
4. **Build Errors**: Run `npm install` and check for missing dependencies

### Development Tips
- Use browser dev tools for debugging
- Check console for API errors
- Verify file paths are correct
- Test on different screen sizes

---

**Status**: ✅ **PRODUCTION READY**

Last Updated: January 2024
Contact: Development Team