#!/usr/bin/env python3
"""
Quick test script for Intellicam AI Engine API
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_start_detection():
    """Test starting detection"""
    print("\n🎥 Testing start detection...")
    payload = {
        "stream_url": "http://10.172.201.200:8080/video",
        "stream_id": "test_camera"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/start_detection", json=payload)
        print(f"✅ Start detection: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.json().get("stream_id")
    except Exception as e:
        print(f"❌ Start detection failed: {e}")
        return None

def test_active_streams():
    """Test active streams endpoint"""
    print("\n📊 Testing active streams...")
    try:
        response = requests.get(f"{BASE_URL}/streams")
        print(f"✅ Active streams: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"❌ Active streams failed: {e}")

def test_stop_detection(stream_id):
    """Test stopping detection"""
    if not stream_id:
        return
        
    print(f"\n🛑 Testing stop detection for {stream_id}...")
    payload = {"stream_id": stream_id}
    
    try:
        response = requests.post(f"{BASE_URL}/stop_detection", json=payload)
        print(f"✅ Stop detection: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"❌ Stop detection failed: {e}")

if __name__ == "__main__":
    print("🚀 Intellicam AI Engine API Test")
    print("=" * 40)
    
    # Test sequence
    if test_health():
        stream_id = test_start_detection()
        time.sleep(2)  # Let it run briefly
        test_active_streams()
        test_stop_detection(stream_id)
    
    print("\n✅ Test completed!")