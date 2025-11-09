from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from models.user import UserCreate, UserResponse, UserUpdate, UserInDB
from auth.schemas import (
    LoginRequest, LoginResponse, VerifyEmailRequest, 
    ResendCodeRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from auth.dependencies import get_current_verified_user
from auth.security import create_access_token
from services.user_service import user_service

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    user = await user_service.create_user(user_data)

    return UserResponse(
        message="Registered successfully, please verify your email",
        user={
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "is_verified": user.is_verified,
            "time_zone": user.time_zone,
            "language": user.language,
            "created_at": user.created_at
        }
    )

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Login user"""
    user = await user_service.authenticate_user(login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not verified"
        )
    
    # Create access token
    access_token_expires = timedelta(hours=5)
    access_token = create_access_token(
        data={
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "is_verified": user.is_verified,
            "time_zone": user.time_zone,
            "created_at": user.created_at.isoformat()
        },
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        message="Login successful",
        token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name
        }
    )

@router.get("/", response_model=UserResponse)
async def get_user(current_user: UserInDB = Depends(get_current_verified_user)):
    """Get current user details"""
    return UserResponse(
        message="Retrieved User Details Successfully",
        user={
            "id": str(current_user.id),
            "full_name": current_user.full_name,
            "email": current_user.email,
            "phone": current_user.phone,
            "is_verified": current_user.is_verified,
            "time_zone": current_user.time_zone,
            "role": current_user.role,
            "language": current_user.language,
            "created_at": current_user.created_at
        }
    )

@router.post("/verify-email", response_model=dict)
async def verify_email(verify_data: VerifyEmailRequest):
    """Verify user email with OTP"""
    await user_service.verify_email(verify_data.email, verify_data.code)
    return {"message": "Email verified successfully"}

@router.post("/resend-code", response_model=dict)
async def resend_code(resend_data: ResendCodeRequest):
    """Resend verification code"""
    await user_service.resend_verification_code(resend_data.email)
    return {"message": "Verification code resent"}

@router.post("/forgot-password", response_model=dict)
async def forgot_password(forgot_data: ForgotPasswordRequest):
    """Send password reset link"""
    print("forgot password", forgot_data)
    await user_service.send_password_reset_link(forgot_data.email)
    return {"message": "Reset link sent successfully"}

@router.post("/reset-password", response_model=dict)
async def reset_password(reset_data: ResetPasswordRequest):
    """Reset password with token"""
    await user_service.reset_password(reset_data.email, reset_data.new_password, reset_data.token)
    return {"message": "Password reset successful"}