# Frontend Dashboard

## For Frontend Engineer (Abdulquadri)

### Required Features:

1. **IP Camera Input Form**
   - User enters camera URL (e.g., http://10.172.201.200:8080/video)
   - Start/Stop monitoring buttons

2. **Live Alerts Display**
   - Real-time detection alerts
   - Object type, confidence, timestamp
   - Status indicator (Safe/Threat)

3. **Detection History**
   - Table of past detections
   - Filter by object type, date

4. **Charts & Visualization**
   - Detection frequency over time
   - Most detected objects
   - Confidence trends

### Backend API Calls:
```javascript
// Start monitoring
POST /api/start-monitoring { camera_url: "http://..." }

// Get alerts
GET /api/alerts

// Stop monitoring  
POST /api/stop-monitoring
```