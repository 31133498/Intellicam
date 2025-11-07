from fastapi import APIRouter, Depends
from auth.dependencies import get_user_with_token
from config.database import get_database
from bson import ObjectId

router = APIRouter()

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    # convert any nested ObjectIds (optional safety)
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
    return doc

@router.get("/")
async def get_alerts(current_user = Depends(get_user_with_token)):
    db = get_database()
    user_id = current_user.user.id

    # Fetch alerts
    alerts = await db.alerts.find({"user_id": user_id}).to_list(length=None)

    # Convert ObjectIds to strings
    serialized_alerts = [serialize_doc(alert) for alert in alerts]

    return serialized_alerts