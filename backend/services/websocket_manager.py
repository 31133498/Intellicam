from typing import Dict, List
from fastapi import WebSocket
import json
import logging
from config.database import get_database
from utils.alert import send_whatsapp, send_sms

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self):
        # Map of user_id (string) -> list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # In-memory queue for undelivered messages per user
        # Note: this is ephemeral and will be lost on process restart.
        self.pending_messages: Dict[str, List[dict]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        """Register a new WebSocket connection for a given user."""
        user_id = str(user_id)  # always store as string
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = []

        self.active_connections[user_id].append(websocket)
        logger.info(f"📡 WebSocket connected for user {user_id}")
        logger.info(f"✅ Current connected users: {list(self.active_connections.keys())}")
        # If we have pending messages for the user (undelivered alerts), send them now
        pending = list(self.pending_messages.get(user_id, []))
        if pending:
            logger.info(f"📨 Delivering {len(pending)} pending message(s) to user {user_id}")
            for msg in pending:
                try:
                    await websocket.send_text(json.dumps(msg))
                except Exception as e:
                    logger.warning(f"⚠️ Failed to deliver pending message to {user_id}: {e}")
                    # leave it for another attempt on next connect
                    break
            else:
                # all messages delivered successfully; clear queue
                try:
                    del self.pending_messages[user_id]
                except KeyError:
                    pass

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove a WebSocket connection when user disconnects."""
        user_id = str(user_id)
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass
        logger.info(f"❌ WebSocket disconnected for user {user_id}")
        logger.info(f"🧾 Remaining connections: {list(self.active_connections.keys())}")

    async def send_to_user(self, user_id: str, message: dict):
        """Send a message to a specific connected user."""
        user_id = str(user_id)
        payload = json.dumps(message)

        logger.info(f"🚀 Attempting to send message to {user_id}")
        logger.info(f"🔑 Active users: {list(self.active_connections.keys())}")

        if user_id not in self.active_connections:
            logger.warning(f"⚠️ No active WebSocket for user {user_id}; queuing message")
            # queue message for later delivery (cap queue size to avoid unbounded memory use)
            queue_list = self.pending_messages.setdefault(user_id, [])
            MAX_PENDING = 50
            queue_list.append(message)
            # trim old messages if exceeded
            if len(queue_list) > MAX_PENDING:
                queue_list[:] = queue_list[-MAX_PENDING:]
            return False

        sent_any = False
        for ws in list(self.active_connections[user_id]):
            try:
                await ws.send_text(payload)
                sent_any = True
            except Exception as e:
                logger.error(f"⚠️ Failed to send message to user {user_id}: {e}")
                self.disconnect(ws, user_id)

        return sent_any

    async def broadcast_alert(self, alert_type: str, camera_id: str, alert_data: dict, target_user_id: str = None):
        """Broadcast alert globally or to a specific user."""
        message = {
            "event": "alert",
            "type": alert_type,
            "camera_id": camera_id,
            "timestamp": alert_data.get("timestamp"),
            "details": alert_data,
        }

        if target_user_id:
            try:
                db = get_database()
                user = await db.users.find_one({"_id": target_user_id})
                phone = user.get("phone") if user else None

                if phone:
                    text = f"{alert_type.replace('_', ' ').title()} detected on camera {camera_id}, {alert_data}"
                    send_sms(phone, text)
                    send_whatsapp(phone, text)

                sent = await self.send_to_user(str(target_user_id), message)
                if sent:
                    logger.info(f"📤 Sent {alert_type} alert from {camera_id} to user {target_user_id}")
                else:
                    logger.info(f"📤 No active WebSocket for user {target_user_id}; alert stored/sent via SMS if configured")
            except Exception as e:
                logger.error(f"❌ Failed to send alert for camera {camera_id}: {e}")
        else:
            payload = json.dumps(message)
            for user_id, conns in self.active_connections.items():
                for ws in conns:
                    try:
                        await ws.send_text(payload)
                    except Exception as e:
                        logger.error(f"⚠️ Failed to broadcast alert to {user_id}: {e}")
                        self.disconnect(ws, user_id)


# ✅ Create one global instance for the whole app
ws_manager = WebSocketManager()