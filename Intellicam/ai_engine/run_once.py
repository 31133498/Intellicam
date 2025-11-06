"""
One-shot test runner for Intellicam inference.
Processes a few frames from the given stream and exits.
"""
import cv2, time, json, requests, os, sys
from datetime import datetime
try:
    from ultralytics import YOLO
except Exception as e:
    print('Failed to import ultralytics:', e)
    sys.exit(1)

STREAM = 'http://10.187.217.1:8080/video'
DETECTION_THRESHOLD = 0.5
BACKEND_URL = 'http://localhost:5000/api/alert'
TARGET_CLASSES = {"knife", "scissors", "gun"}
FRAME_DIR = os.path.join(os.path.dirname(__file__), 'frames')
LOG_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'detections.log')

os.makedirs(FRAME_DIR, exist_ok=True)

print('Loading YOLOv8n...')
model = YOLO('yolov8n.pt')
print('Model loaded. Classes:', list(model.names.values()))

cap = cv2.VideoCapture(STREAM)
print('Opened stream:', cap.isOpened())

frames_to_process = 5
processed = 0
last_proc = 0

while processed < frames_to_process:
    ret, frame = cap.read()
    if not ret:
        print('Frame read failed, retrying briefly...')
        time.sleep(0.5)
        continue
    # process at ~1 FPS
    now = time.time()
    if now - last_proc < 1.0:
        time.sleep(0.1)
        continue
    last_proc = now
    processed += 1
    print(f'Processing frame {processed}')

    # run inference
    try:
        results = model(frame, conf=DETECTION_THRESHOLD)[0]
    except Exception as e:
        print('Model inference error:', e)
        break

    detections = []
    for r in results.boxes.data.tolist():
        x1, y1, x2, y2, conf, class_id = r
        class_name = model.names[int(class_id)]
        if class_name in TARGET_CLASSES or len(TARGET_CLASSES.intersection(model.names.values()))==0:
            det = {
                'object': class_name,
                'confidence': float(round(conf,2)),
                'bbox': [int(x1),int(y1),int(x2),int(y2)]
            }
            detections.append(det)
    
    if not detections:
        print('No relevant detections in this frame')
        continue

    # for each detection, save frame and send alert
    for i,det in enumerate(detections):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        frame_name = f'frame_{timestamp}_{processed}_{i}.jpg'
        frame_path = os.path.join(FRAME_DIR, frame_name)
        # draw bbox
        x1,y1,x2,y2 = det['bbox']
        cv2.rectangle(frame, (x1,y1),(x2,y2),(0,255,0),2)
        cv2.putText(frame, f"{det['object']} {det['confidence']:.2f}", (x1, max(y1-10,0)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0),2)
        cv2.imwrite(frame_path, frame)
        print('Saved', frame_path)

        payload = {
            'object': det['object'],
            'confidence': det['confidence'],
            'timestamp': datetime.now().isoformat(),
            'frame_id': frame_name
        }
        # append to log
        try:
            with open(LOG_FILE,'a',encoding='utf-8') as f:
                f.write(json.dumps(payload)+"\n")
            print('Logged detection to', LOG_FILE)
        except Exception as e:
            print('Failed to write log:', e)

        # try POST once, retry once
        success = False
        for attempt in range(2):
            try:
                resp = requests.post(BACKEND_URL, json=payload, timeout=3)
                resp.raise_for_status()
                print('✅ Alert sent to backend (status)', resp.status_code)
                success = True
                break
            except Exception as e:
                print('POST failed attempt', attempt+1, 'error:', e)
                time.sleep(1)
        if not success:
            print('Backend not reachable; continuing')

cap.release()
print('Done processing')
