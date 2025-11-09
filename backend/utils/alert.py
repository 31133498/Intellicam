import os
import logging

logger = logging.getLogger(__name__)

# Try to import Twilio but don't fail if it's not installed in the environment
try:
    from twilio.rest import Client
    _TWILIO_AVAILABLE = True
except Exception:
    Client = None
    _TWILIO_AVAILABLE = False
    logger.warning("Twilio package not available; send_sms/send_whatsapp will be no-ops")

# Get credentials once
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
SMS_NUMBER = os.getenv("TWILIO_NUMBER_TRIAL")            # Example: "+1234567890"
WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")    # Example: "whatsapp:+14155238886"

# Initialize Twilio client if possible and credentials exist
client = None
if _TWILIO_AVAILABLE and ACCOUNT_SID and AUTH_TOKEN:
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
    except Exception as e:
        logger.warning(f"Failed to initialize Twilio Client: {e}")
        client = None


def send_sms(to_number: str, message: str):
    """
    Send an SMS alert to the given phone number.
    Returns True on success, False on failure or when Twilio isn't available.
    """
    if client is None:
        logger.warning("send_sms called but Twilio client is not configured")
        return False

    if not SMS_NUMBER:
        logger.error("Twilio SMS 'from' number is not configured (TWILIO_NUMBER_TRIAL). Aborting SMS send.")
        return False

    try:
        to_number = str(to_number)
        normalized_to = to_number if to_number.startswith("+") else f"+234{to_number}"
        client.messages.create(
            body=f"🚨 ALERT: {message}",
            from_=SMS_NUMBER,
            to=normalized_to
        )
        logger.info(f"✅ SMS sent to {normalized_to}")
        return True
    except Exception as e:
        logger.exception(f"❌ SMS failed for {to_number}: {e}")
        return False


def send_whatsapp(to_number: str, message: str):
    """
    Send a WhatsApp alert via Twilio Sandbox.
    Returns True on success, False on failure or when Twilio isn't available.
    """
    if client is None:
        logger.warning("send_whatsapp called but Twilio client is not configured")
        return False
    to_number = str(to_number)

    if not WHATSAPP_NUMBER:
        logger.error("Twilio WhatsApp 'from' number is not configured (TWILIO_WHATSAPP_NUMBER). Aborting WhatsApp send.")
        return False

    try:
        normalized_to = to_number if to_number.startswith('+') else '+234' + str(to_number)
        # Twilio expects the 'from_' for WhatsApp to be the approved WhatsApp sender (e.g. 'whatsapp:+14155238886' for sandbox)
        from_number = WHATSAPP_NUMBER if WHATSAPP_NUMBER.startswith('whatsapp:') else f'whatsapp:{WHATSAPP_NUMBER}'
        client.messages.create(
            body=f"🚨 ALERT: {message}",
            from_=from_number,
            to=f"whatsapp:{normalized_to}"
        )
        logger.info(f"✅ WhatsApp sent to {normalized_to}")
        return True
    except Exception as e:
        logger.exception(f"❌ WhatsApp failed for {to_number}: {e}")
        return False