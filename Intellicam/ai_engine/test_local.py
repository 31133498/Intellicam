import requests
import base64
import json

def test_local_ai():
    """Test the local AI engine with a sample image"""
    
    # Test health endpoint
    try:
        response = requests.get('http://localhost:5001/health')
        print("Health check:", response.json())
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Create a simple test image (you can replace this with actual webcam capture)
    import cv2
    import numpy as np
    
    # Create a dummy image for testing
    test_image = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(test_image, "TEST IMAGE", (200, 240), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3)
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', test_image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # Test detection
    payload = {"image": image_base64}
    
    try:
        response = requests.post('http://localhost:5001/detect', json=payload)
        print("Detection result:", json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Detection test failed: {e}")

if __name__ == "__main__":
    test_local_ai()