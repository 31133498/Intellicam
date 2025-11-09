#!/usr/bin/env python3
"""
Quick start script for Intellicam with webcam
"""
import cv2
from ultralytics import YOLO

# Load model
print("Loading YOLOv8 model...")
model = YOLO('yolov8n.pt')
print("✅ Model loaded!")

# Connect to webcam
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("Starting webcam detection. Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Run detection
    results = model(frame, conf=0.5)
    
    # Draw results
    annotated_frame = results[0].plot()
    
    # Show frame
    cv2.imshow('Webcam Detection', annotated_frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()