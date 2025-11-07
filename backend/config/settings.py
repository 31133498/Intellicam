from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    mongo_uri: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 2
    database_name: str = "test"

    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    client_url: str
    staging_url: str
    ai_url: str

    model_config = {
        "env_file": ".env",
        "extra": "allow",
    }

settings = Settings()