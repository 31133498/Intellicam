import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict
import os
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

async def send_email(email_data: Dict[str, str]) -> bool:
    sender_email = os.getenv("SMTP_USERNAME")  # your email
    sender_password = os.getenv("SMTP_PASSWORD")  # your app password
    receiver_email = email_data["to"]

    message = Mail(
    from_email=sender_email,
    to_emails=receiver_email,
    subject=email_data["subject"],
    html_content=email_data.get("html"))
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)


def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    import random
    return str(random.randint(100000, 999999))

def generate_reset_token() -> str:
    """Generate a secure reset token"""
    import secrets
    return secrets.token_urlsafe(32)