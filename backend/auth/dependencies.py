from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from auth.security import verify_token
from config.database import get_database
from models.user import UserInDB, UserWithToken


class UserContext:
    """Lightweight object exposing user, token and id for route compatibility."""
    def __init__(self, user: UserInDB, token: str):
        self.user = user
        self.token = token
        
        try:
            self.id = str(user.id)
        except Exception:
            # fallback if user.id isn't set as expected
            self.id = getattr(user, 'id', None)

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserInDB:
    """Get the current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    user_id = payload.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    db = get_database()
    user_data = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    user_data["_id"] = str(user_data["_id"])
    
    return UserInDB(**user_data)

async def get_current_verified_user(
    current_user: UserInDB = Depends(get_current_user)
) -> UserInDB:
    """Get the current authenticated and verified user"""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not verified"
        )
    return current_user


async def get_user_with_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserWithToken:
    """Get the current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)

    print("Token payload:", payload)
    
    user_id = payload.get("id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    db = get_database()
    user_data = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    user_data["_id"] = str(user_data["_id"])

    user_in_db = UserInDB(**user_data)

    return UserContext(user=user_in_db, token=token)