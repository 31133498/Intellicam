from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import ws_manager

ws_router = APIRouter()

@ws_router.websocket("/alerts/{user_id}")
async def websocket_alerts(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for user-specific alerts"""
    await ws_manager.connect(websocket, user_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id)