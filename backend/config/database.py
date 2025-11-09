from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
from config.settings import settings

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = None
database = None

async def connect_db():
    global client, database
    try:
        client = AsyncIOMotorClient(
            settings.mongo_uri, 
            server_api=ServerApi('1'),
            tls=True,
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True 
        )
        database = client[settings.database_name]
        print("✅ MongoDB connected")
    except Exception as error:
        print(f"❌ MongoDB connection error: {error}")
        raise

async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    return database