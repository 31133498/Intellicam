"""
Configuration file for Intellicam AI Engine.
Centralizes settings for easy customization.
"""

import os

# Detection settings
DETECTION_THRESHOLD = 0.5  # Confidence threshold for detections
FRAME_INTERVAL = 1  # Process 1 frame per second
TARGET_CLASSES = {"knife", "scissors", "gun", "person", "car"}  # Expanded for anomalies (intrusion, loitering)

# Camera settings
DEFAULT_CAMERA_WIDTH = 640
DEFAULT_CAMERA_HEIGHT = 480

# Backend settings
BACKEND_URL = "http://localhost:5000/api/alert"

# Motion detection settings
MOTION_THRESHOLD = 5000  # Minimum contour area for motion detection
MOTION_BLUR_SIZE = (21, 21)  # Gaussian blur for motion

# Paths
MODEL_PATH = "yolov8n.pt"  # Default model; replace with custom if trained
FRAMES_DIR = os.path.join(os.path.dirname(__file__), "frames")
LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "detections.log")

# Alert settings
ALERT_CONFIDENCE_THRESHOLD = 0.7  # Minimum confidence to trigger Twilio alert (backend handles)

# Multi-camera (placeholder for future)
CAMERA_SOURCES = ["0"]  # List of sources; e.g., ["0", "http://ip:port/video"]
