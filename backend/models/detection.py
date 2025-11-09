from pydantic import BaseModel

class DetectionRequest(BaseModel):
    user_id: str
    stream_id: str
    stream_url: str

class DetectionResponse(BaseModel):
    status: str # detection_started
    stream_id: str
    message: str
