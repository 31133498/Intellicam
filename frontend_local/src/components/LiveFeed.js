import React, { useState, useRef, useEffect } from 'react';
import aiService from '../services/aiService';

function LiveFeed({ streamUrl, isMonitoring, onDetection }) {
  const [imageError, setImageError] = useState(false);
  const [detections, setDetections] = useState([]);
  const [isWebcam, setIsWebcam] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isMonitoring && streamUrl === 'webcam') {
      setIsWebcam(true);
      startWebcam();
    } else {
      setIsWebcam(false);
      stopWebcam();
    }

    return () => stopWebcam();
  }, [isMonitoring, streamUrl]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start AI detection every 2 seconds
        intervalRef.current = setInterval(captureAndDetect, 2000);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setImageError(true);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDetections([]);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    try {
      const result = await aiService.detectFrame(imageData, 'demo_webcam');
      if (result.detections && result.detections.length > 0) {
        setDetections(result.detections);
        // Call onDetection for EACH detection to add to alert logs
        result.detections.forEach(detection => {
          if (onDetection) {
            onDetection({
              object: detection.object,
              confidence: detection.confidence,
              timestamp: new Date().toISOString(),
              session_id: 'demo_webcam'
            });
          }
        });
      } else {
        setDetections([]);
      }
    } catch (err) {
      console.error('AI detection error:', err);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full">
      <h2 className="text-xl font-semibold mb-2">Live Feed</h2>
      
      {/* Detection Status */}
      {detections.length > 0 && (
        <div className="mb-2 p-2 bg-red-900/50 border border-red-500 rounded">
          <div className="text-red-300 font-semibold">🚨 THREATS DETECTED:</div>
          {detections.map((det, i) => (
            <div key={i} className="text-red-200 text-sm">
              {det.object} ({Math.round(det.confidence * 100)}%)
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-black aspect-video rounded overflow-hidden flex items-center justify-center relative">
        {isMonitoring && streamUrl ? (
          isWebcam ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {detections.length === 0 && (
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                  ✓ Monitoring Active
                </div>
              )}
            </>
          ) : (
            imageError ? (
              <p className="text-red-400">Failed to load camera feed. Check URL and network.</p>
            ) : (
              <img
                src={streamUrl}
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            )
          )
        ) : (
          <p className="text-gray-400">Monitoring is Idle</p>
        )}
      </div>
    </div>
  );
}

export default LiveFeed;