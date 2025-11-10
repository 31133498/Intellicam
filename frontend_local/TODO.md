# Frontend-Backend Integration TODO

## Completed Tasks
- [x] Analyze current mock implementations and hardcoded URLs
- [x] Understand backend API structure and endpoints
- [x] Create AuthContext for JWT token management and user state
- [x] Create API service file for centralized API calls
- [x] Update Auth.js to use correct backend port (5000) and proper JWT handling
- [x] Update CameraInputForm.js to use real monitoring endpoints (/api/monitoring/start, /api/monitoring/stop)
- [x] Update Dashboard.js to fetch real alerts from /api/alerts and implement WebSocket for real-time updates
- [x] Add auth guards to protected routes in App.js

## Pending Tasks
- [ ] Update AlertLog.js to fetch initial alerts data (handled in Dashboard now)
- [ ] Update Chatbot.js to work with real alert data
- [ ] Handle API errors and loading states properly across components
- [ ] Test full integration with backend running
- [ ] Handle CORS issues if any arise
- [ ] Add logout functionality to StatusHeader or Dashboard
