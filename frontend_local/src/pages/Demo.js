import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aiService from '../services/aiService';

function Demo() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const startDemo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
        
        // Start AI detection every 2 seconds
        intervalRef.current = setInterval(captureAndDetect, 2000);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Please allow camera access for the demo');
    }
  };

  const stopDemo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
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

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    try {
      const result = await aiService.detectFrame(imageData, 'live_demo');
      if (result.detections && result.detections.length > 0) {
        setDetections(result.detections);
        // Add to alerts history
        const newAlerts = result.detections.map(det => ({
          id: Date.now() + Math.random(),
          ...det,
          time: new Date().toLocaleTimeString()
        }));
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      } else {
        setDetections([]);
      }
    } catch (err) {
      console.error('AI detection error:', err);
    }
  };

  useEffect(() => {
    return () => stopDemo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold">Intellicam Live Demo</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm">{isActive ? 'AI Monitoring Active' : 'Demo Idle'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Live Camera Feed</h2>
              
              {/* Threat Alert */}
              {detections.length > 0 && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                  <div className="text-red-300 font-semibold mb-2">🚨 THREATS DETECTED:</div>
                  {detections.map((det, i) => (
                    <div key={i} className="text-red-200 text-sm">
                      <strong>{det.object}</strong> - Confidence: {Math.round(det.confidence * 100)}%
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-black aspect-video rounded-lg overflow-hidden flex items-center justify-center relative">
                {isActive ? (
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
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        ✓ Monitoring
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Click "Start Demo" to begin AI surveillance</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                {!isActive ? (
                  <button
                    onClick={startDemo}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Demo
                  </button>
                ) : (
                  <button
                    onClick={stopDemo}
                    className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop Demo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 h-full">
              <h2 className="text-xl font-semibold mb-4">Detection History</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No detections yet</p>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="bg-gray-700 rounded-lg p-3 border-l-4 border-red-500">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-red-300">{alert.object}</span>
                        <span className="text-xs text-gray-400">{alert.time}</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Confidence: {Math.round(alert.confidence * 100)}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">🎯 Demo Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">What This Demo Shows:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Real-time AI object detection</li>
                <li>• Threat identification (knife, gun, scissors)</li>
                <li>• Live camera feed processing</li>
                <li>• Instant alert notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Try This:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Show objects to your camera</li>
                <li>• Watch for real-time detection</li>
                <li>• See confidence scores</li>
                <li>• View detection history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;