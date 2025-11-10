import requests
import cv2
import base64

# Test what AI can detect
def test_ai():
    # Create test image with text
    import numpy as np
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(img, "TEST", (200, 240), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 3)
    
    # Encode to base64
    _, buffer = cv2.imencode('.jpg', img)
    img_b64 = base64.b64encode(buffer).decode()
    
    # Test health
    try:
        health = requests.get('http://localhost:5001/health').json()
        print(f"AI Status: {health['status']}")
        print(f"Total Classes: {health['total_classes']}")
        print(f"Classes: {health['all_classes'][:10]}...")  # First 10
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Test detection
    try:
        response = requests.post('http://localhost:5001/detect', json={'image': img_b64})
        result = response.json()
        print(f"Detection result: {result}")
    except Exception as e:
        print(f"Detection failed: {e}")

if __name__ == "__main__":
    test_ai()