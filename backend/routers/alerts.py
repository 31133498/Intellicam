from fastapi import APIRouter, Depends
from auth.dependencies import get_user_with_token
from config.database import get_database
from bson import ObjectId
from models.alert import AlertResponse, AlertBase

router = APIRouter()

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
    return doc

@router.get("/", response_model=AlertResponse)
async def get_alerts(current_user = Depends(get_user_with_token)):
    db = get_database()
    user_id = str(current_user.user.id)

    alerts = await db.alerts.find({"user_id": user_id}).to_list(length=None)

    serialized_alerts = [serialize_doc(alert) for alert in alerts]

    return AlertResponse(serialized_alerts)

@router.post("/", response_model=dict)
async def receive_alert(detection: AlertBase):
    """Receive alert and send alert based on confidence"""
    db = get_database()

    await db.alerts.insert_one(detection)

    return {
        "message": "Sent succesfully"
    }