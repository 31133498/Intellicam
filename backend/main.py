from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from config.database import connect_db, close_db
from routers import users, alerts, monitoring
from routers.websocket_router import ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="Intellicam Backend",
    description="AI-powered surveillance backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Intellicam Backend is running!"}

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["monitoring"])
app.include_router(ws_router, prefix="/api/ws", tags=["websocket"])




if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)