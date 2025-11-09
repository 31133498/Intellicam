from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status
from config.database import get_database
from models.user import UserCreate, UserInDB
from auth.security import get_password_hash, verify_password
from utils.email import send_email, generate_otp, generate_reset_token

class UserService:
    def __init__(self):
        self.db = get_database()
    
    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Create a new user"""
        db = get_database()
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists"
            )
        
        verification_code = generate_otp()
        verification_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        hashed_password = get_password_hash(user_data.password)
        
        user_doc = {
            **user_data.dict(exclude={"password"}),
            "password": hashed_password,
            "email_verification_code": verification_code,
            "email_verification_expires": verification_expiry,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        
        # Send verification email
        await send_email({
            "to": user_data.email,
            "subject": "Verify your email",
            "html": self._get_verification_email_template(verification_code)
        })
        
        return UserInDB(**user_doc)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticate a user"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            return None
        user_data = await db.users.find_one({"email": email})
        user_data["_id"] = str(user_data["_id"])
        
        user = UserInDB(**user_data)
        if not verify_password(password, user.password):
            return None
        
        return user
    
    async def verify_email(self, email: str, code: str) -> bool:
        """Verify user email with OTP"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_data["_id"] = str(user_data["_id"])
        
        user = UserInDB(**user_data)
        
        if user.is_verified:
            return True
        
        if (not user.email_verification_expires or 
            datetime.utcnow() > user.email_verification_expires):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired"
            )
        
        if user.email_verification_code != code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )
        
        # Update user as verified
        await db.users.update_one(
            {"_id": user.id},
            {
                "$set": {
                    "is_verified": True,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "email_verification_code": "",
                    "email_verification_expires": ""
                }
            }
        )
        
        return True
    
    async def resend_verification_code(self, email: str) -> bool:
        """Resend verification code"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_data["_id"] = str(user_data["_id"])
        user = UserInDB(**user_data)
        
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified"
            )
        
        # Generate new code
        new_code = generate_otp()
        verification_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        await db.users.update_one(
            {"_id": user.id},
            {
                "$set": {
                    "email_verification_code": new_code,
                    "email_verification_expires": verification_expiry,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Send verification email
        await send_email({
            "to": email,
            "subject": "Your verification code",
            "html": self._get_verification_email_template(new_code)
        })
        
        return True
    
    async def resend_verification_code(self, email: str) -> bool:
        """Resend verification code"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_data["_id"] = str(user_data["_id"])
        user = UserInDB(**user_data)
        
        if user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified"
            )
        
        # Generate new code
        new_code = generate_otp()
        verification_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        await db.users.update_one(
            {"_id": user.id},
            {
                "$set": {
                    "email_verification_code": new_code,
                    "email_verification_expires": verification_expiry,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Send verification email
        await send_email({
            "to": email,
            "subject": "Your verification code",
            "html": self._get_verification_email_template(new_code)
        })
        
        return True
    
    async def send_password_reset_link(self, email: str) -> bool:
        """Reset Password Link"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_data["_id"] = str(user_data["_id"])
        user = UserInDB(**user_data)
        
        if (user.reset_password_token and datetime.utcnow() < user.reset_password_expires):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset link is already sent"
            )
        # Generate new token
        new_token = generate_reset_token()
        reset_expiry = datetime.utcnow() + timedelta(minutes=10)

        new_link = f"https://intellicam-seven.vercel.app/reset-password?token={new_token}"
        
        await db.users.update_one(
            {"_id": user.id},
            {
                "$set": {
                    "reset_password_token": new_token,
                    "reset_password_expires": reset_expiry,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Send password reset email
        await send_email({
            "to": email,
            "subject": "Your password reset link",
            "html": self._get_password_reset_email_template(new_link, user.full_name)
        })
        
        return True

    async def reset_password(self, email: str, new_password: str, token: str) -> bool:
        """Reset password with token"""
        db = get_database()
        user_data = await db.users.find_one({"email": email})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        user_data["_id"] = str(user_data["_id"])
        
        user = UserInDB(**user_data)

        if (not user.reset_password_expires or 
            datetime.utcnow() > user.reset_password_expires):
            await db.users.update_one(
                {"_id": user.id},
                {
                    "$unset": {
                        "reset_password_token": "",
                        "reset_password_expires": ""
                    }
                }
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )

        if user.reset_password_token != token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        hashed_password = get_password_hash(new_password)
        
        # Update user as verified
        await db.users.update_one(
            {"_id": user.id},
            {
                "$set": {
                    "password": hashed_password,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "reset_password_token": "",
                    "reset_password_expires": ""
                }
            }
        )
        
        return True
    
    def _get_verification_email_template(self, code: str) -> str:
        """Get verification email HTML template"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>OTP Email - Intellicam</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    background-color: #f4f4f7;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }}
                .email-container {{
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }}
                .email-header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .email-header h2 {{
                    color: #333;
                }}
                .otp-box {{
                    font-size: 32px;
                    letter-spacing: 10px;
                    font-weight: bold;
                    background-color: #f0f4ff;
                    color: #1a73e8;
                    padding: 15px 20px;
                    text-align: center;
                    border-radius: 8px;
                    margin: 30px 0;
                }}
                .email-body {{
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }}
                .email-footer {{
                    text-align: center;
                    margin-top: 30px;
                    font-size: 13px;
                    color: #999;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>Verify Your Email</h2>
                </div>
                <div class="email-body">
                    <p>Hello,</p>
                    <p>Use the following One-Time Password (OTP) to complete your sign-in or verification process. This code is valid for the next 10 minutes.</p>
                    <div class="otp-box">{code}</div>
                    <p>If you did not request this code, you can safely ignore this email.</p>
                    <p>Thank you,<br>The Intellicam Team</p>
                </div>
                <div class="email-footer">
                    &copy; 2025 Intellicam. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
    

    def _get_password_reset_email_template(self, resetLink: str, name: str) -> str:
        """Get password reset email HTML template"""
        return f"""
        <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Reset Your Password</title>
                <style>
                  body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f7;
                    color: #333;
                    margin: 0;
                    padding: 0;
                  }}
                  .container {{
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                  }}
                  h2 {{
                    color: #2c3e50;
                  }}
                  .button {{
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff !important;
                    padding: 12px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 20px;
                  }}
                  .footer {{
                    text-align: center;
                    color: #999;
                    font-size: 13px;
                    margin-top: 30px;
                  }}
                  a {{
                    color: #007bff;
                  }}
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Reset Your Password</h2>
                  <p>Hi {name},</p>
                  <p>We received a request to reset your password. Click the button below to choose a new one:</p>

                  <a href="{resetLink}" class="button">Reset Password</a>

                  <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                  <p><a href="{resetLink}">{resetLink}</a></p>

                  <p>This link will expire in 15 minutes for your security.</p>

                  <p>If you didn't request a password reset, you can safely ignore this email.</p>

                  <p>– The Intellicam Team</p>

                  <div class="footer">
                    <p>You received this email because a password reset was requested for your account.</p>
                  </div>
                </div>
              </body>
            </html>
        """

user_service = UserService()