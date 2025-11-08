from pydantic import BaseModel, EmailStr, Field, GetJsonSchemaHandler, GetCoreSchemaHandler, PositiveFloat
from pydantic_core import core_schema
from pydantic.json_schema import JsonSchemaValue, GetJsonSchemaHandler
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler: GetCoreSchemaHandler) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(    
            cls.validate,
            core_schema.str_schema(),
        )

    @classmethod
    def __get_pydantic_json_schema__(cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler) -> JsonSchemaValue:
        # Make sure OpenAPI sees it as a string
        return handler(core_schema.str_schema())

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class AlertBase(BaseModel):
    object: str
    confidence: float
    timestamp: datetime
    stream_id: str
    user_id: str


class AlertInDb(AlertBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    password: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str
        }
    }


class AlertResponse(AlertBase):
    message: str
    alert: AlertInDb

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str
        }
    }