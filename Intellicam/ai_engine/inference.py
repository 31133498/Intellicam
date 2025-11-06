#!/usr/bin/env python3
"""
Intellicam - Smart Predictive Surveillance
AI Inference Module for detecting harmful objects in real-time camera streams.
Supports both IP camera and PC webcam input.
"""

import cv2
import time
import json
import logging
import argparse
import requests
import numpy as np
from pathlib import Path
from datetime import datetime
from ultralytics import YOLO
from config import (
    DETECTION_THRESHOLD, BACKEND_URL, TARGET_CLASSES, FRAME_INTERVAL,
    DEFAULT_CAMERA_WIDTH, DEFAULT_CAMERA_HEIGHT, MODEL_PATH, FRAMES_DIR,
    LOG_FILE, ALERT_CONFIDENCE_THRESHOLD, MOTION_THRESHOLD, MOTION_BLUR_SIZE
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)

def connect_camera(stream_url):
    """
    Connect to IP camera stream or webcam.
    
    Args:
        stream_url: Can be:
            - Integer for webcam (e.g., 0 for built-in webcam)
            - URL string for IP camera stream
            
    Returns:
        cv2.VideoCapture: OpenCV video capture object
    """
    # Try to connect to the camera source
    cap = cv2.VideoCapture(stream_url)
    
    if not cap.isOpened():
        raise ConnectionError(f"Failed to connect to camera source: {stream_url}")
    
    # Set frame properties for better performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Display camera info
    source_type = "webcam" if isinstance(stream_url, int) else "IP camera"
    logging.info(f"Successfully connected to {source_type}: {stream_url}")
    
    return cap

def detect_motion(frame, prev_frame):
    """
    Detect motion in frame using background subtraction.

    Args:
        frame: Current OpenCV frame
        prev_frame: Previous frame for comparison

    Returns:
        bool: True if motion detected
    """
    if prev_frame is None:
        return False

    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, MOTION_BLUR_SIZE, 0)

    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    prev_gray = cv2.GaussianBlur(prev_gray, MOTION_BLUR_SIZE, 0)

    # Compute difference
    frame_delta = cv2.absdiff(prev_gray, gray)
    thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]

    # Dilate threshold image to fill in holes
    thresh = cv2.dilate(thresh, None, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Check for significant motion
    for contour in contours:
        if cv2.contourArea(contour) > MOTION_THRESHOLD:
            return True
    return False

def detect_objects(frame, model):
    """
    Detect objects in a frame using YOLOv8 model.

    Args:
        frame: OpenCV frame
        model: YOLOv8 model instance

    Returns:
        list: List of detections with class, confidence and coordinates
    """
    # Run inference on frame
    results = model(frame, conf=DETECTION_THRESHOLD)[0]
    detections = []

    # Process each detection
    for r in results.boxes.data.tolist():
        x1, y1, x2, y2, conf, class_id = r
        class_name = model.names[int(class_id)]

        # Check if detected object is in target classes or simulate detection for demo
        if class_name in TARGET_CLASSES or len(TARGET_CLASSES.intersection(model.names.values())) == 0:
            detection = {
                "object": class_name,
                "confidence": round(conf, 2),
                "bbox": [round(x) for x in [x1, y1, x2, y2]]
            }
            detections.append(detection)

    return detections

def save_frame(frame, detection, frame_dir="frames"):
    """
    Save frame with detection as image file.
    
    Args:
        frame: OpenCV frame
        detection (dict): Detection information
        frame_dir (str): Directory to save frames
        
    Returns:
        str: Name of saved frame file
    """
    # Create frames directory if it doesn't exist
    frame_path = Path(frame_dir)
    frame_path.mkdir(exist_ok=True)
    
    # Generate unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    frame_name = f"frame_{timestamp}.jpg"
    frame_file = frame_path / frame_name
    
    # Draw bounding box on frame
    x1, y1, x2, y2 = detection["bbox"]
    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
    cv2.putText(frame, f"{detection['object']} {detection['confidence']:.2f}",
                (int(x1), int(y1-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # Save frame
    cv2.imwrite(str(frame_file), frame)
    logging.info(f"Saved detection frame: {frame_name}")
    return frame_name

def send_alert(detection, frame_name):
    """
    Send detection alert to backend API.
    
    Args:
        detection (dict): Detection information
        frame_name (str): Name of saved frame file
        
    Returns:
        bool: True if alert was sent successfully
    """
    payload = {
        "object": detection["object"],
        "confidence": detection["confidence"],
        "timestamp": datetime.now().isoformat(),
        "frame_id": frame_name
    }
    
    # Try sending alert twice in case of failure
    for attempt in range(2):
        try:
            response = requests.post(BACKEND_URL, json=payload)
            response.raise_for_status()
            logging.info("✅ Alert sent to backend")
            return True
        except requests.exceptions.RequestException as e:
            if attempt == 0:
                logging.warning(f"Failed to send alert, retrying... Error: {e}")
            else:
                logging.error(f"Failed to send alert after retry. Error: {e}")
    return False

def main(stream_url):
    """
    Main inference loop.
    
    Args:
        stream_url: Camera source (IP camera URL or webcam index)
    """
    # Load YOLOv8 model
    print("Loading YOLOv8n model...")
    model = YOLO('yolov8n.pt')
    print("✅ Model loaded successfully!")
    logging.info("Loaded YOLOv8n model")
    print(f"\nAvailable classes: {list(model.names.values())}")
    print("\nPress 'q' to quit the application")
    
    # Connect to camera
    cap = connect_camera(stream_url)
    last_process_time = time.time()
    
    try:
        while True:
            # Read frame from camera
            ret, frame = cap.read()
            if not ret:
                logging.error("Failed to read frame from camera")
                break
                
            # Process one frame per second
            current_time = time.time()
            if current_time - last_process_time < FRAME_INTERVAL:
                # Show live preview
                cv2.imshow('Intellicam Detection', frame)
                
                # Check for 'q' key to quit
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                continue
                
            last_process_time = current_time
            
            # Detect objects in frame
            detections = detect_objects(frame, model)
            
            # Process detections
            for detection in detections:
                # Save frame with detection
                frame_name = save_frame(frame, detection)
                
                # Send alert to backend
                send_alert(detection, frame_name)
                
                # Log detection
                logging.info(
                    f"Detection: {detection['object']}, "
                    f"Confidence: {detection['confidence']:.2f}, "
                    f"Frame: {frame_name}"
                )
    
    except KeyboardInterrupt:
        logging.info("Stopping inference...")
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Intellicam AI Inference Module")
    parser.add_argument("--stream", "--source", dest="source",
                      default="0",
                      help="Camera source: IP camera URL or webcam index (default: 0 for built-in webcam)")
    args = parser.parse_args()
    
    # Convert source to integer if it's a number (webcam index)
    source = args.source
    if source.isdigit():
        source = int(source)
    
    # Start inference
    main(source)