# INTELLICAM Professional Frontend

## 🚀 Quick Setup

### Install & Run
```bash
npm install
npm start
```
Runs on `http://localhost:3000`

### Environment Setup
Create `.env` file:
```
REACT_APP_GROQ_API_KEY=your-groq-api-key-here
```

## 🎯 Features
- **Professional Security Dashboard** - Real-time monitoring interface
- **AI Detection System** - Live webcam object detection
- **AI Security Copilot** - Intelligent security assistant
- **Responsive Design** - Works on all devices
- **Alert System** - Sound notifications for threats

## 🔧 Architecture
- **React 18** - Modern frontend framework
- **Tailwind CSS** - Professional styling
- **Local AI Integration** - Connects to AI engine on port 8000
- **localStorage Auth** - Simple authentication system

## 📱 Pages
- `/` - Landing page
- `/auth` - Login/Register
- `/dashboard` - Main security dashboard
- `/ai-copilot` - AI assistant interface
- `/test-ai` - AI detection testing

## 🛠️ Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔗 API Integration
Frontend connects to AI engine at `http://localhost:8000`

Required AI engine endpoints:
- `POST /detect` - Object detection
- `GET /health` - Health check