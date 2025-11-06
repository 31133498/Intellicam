# Backend Service

## For Backend Engineer (Wisdom)

### Required Endpoints:

1. **POST /api/alert** - Receive detections from AI engine
2. **POST /api/start-monitoring** - Start AI detection on user's IP camera
3. **POST /api/stop-monitoring** - Stop AI detection
4. **GET /api/alerts** - Get detection history for frontend

### AI Engine Integration:
- AI Engine URL: `http://ai-engine:8000`
- Call `/start_detection` and `/stop_detection` endpoints
- Receive detection alerts on `/api/alert`

### Twilio Integration:
- Send alerts when confidence > 0.7
- WhatsApp/SMS notifications

### Database Schema:
```sql
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY,
    object TEXT,
    confidence REAL,
    timestamp TEXT,
    stream_id TEXT
);
```