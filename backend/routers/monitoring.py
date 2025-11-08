from fastapi import APIRouter, Depends, HTTPException
from auth.dependencies import get_user_with_token
from models.detection import DetectionRequest, DetectionResponse
import logging
import httpx
from config.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/start", response_model=DetectionResponse)
async def start_monitoring(stream: DetectionRequest, current_user = Depends(get_user_with_token)):
    """Start Detection"""

    try:
        detection_payload = {
            "stream_url": stream.stream_url,
            "stream_id": stream.stream_id,
            "user_id": current_user.user.id
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"📤 Starting Detection: stream.stream_url")
            
            response = await client.post(
                f"{settings.ai_url}/start_detection",
                json=detection_payload
            )

            print(response)
            
            logger.info(f"📥 Staging server response status: {response.status_code}")
            if response.status_code < 400:
                logger.info(f"✅ Started successful")
            else:
                logger.error(f"❌ Starting Detection failed: {response.text[:500]}")
    except Exception as e:
        logger.error(f"Unexpected error in starting detection: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Unexpected error", "message": str(e)}
        )

    response_data = response.json()
    return DetectionResponse(
        status=response_data["status"],
        stream_id=response_data["stream_id"],
        message="Succesfully Started Detection"
    )


@router.post("/stop", response_model=dict)
async def start_monitoring(stream: DetectionRequest, current_user = Depends(get_user_with_token)):
    """Stop Detection"""

    try:
        detection_payload = {
            "stream_id": stream.stream_id,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"📤 Stopping Detection: stream.stream_url")
            
            response = await client.post(
                f"{settings.ai_url}/stop_detection",
                json=detection_payload
            )

            print(response)
            
            logger.info(f"📥 Staging server response status: {response.status_code}")
            if response.status_code < 400:
                logger.info(f"✅ Stopped successful")
            else:
                logger.error(f"❌ Stopping Detection failed: {response.text[:500]}")
    except Exception as e:
        logger.error(f"Unexpected error in stopping detection: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Unexpected error", "message": str(e)}
        )

    response_data = response.json()
    return {
        "message": "Succesfully stopped detection",
        "status": response_data["status"]
    }