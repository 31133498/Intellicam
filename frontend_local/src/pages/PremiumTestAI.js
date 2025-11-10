import React, { useState, useRef, useEffect } from 'react';
import aiService from '../services/aiService';
import { useAlertSound } from '../hooks/useAlertSound';
import { Camera, Play, Square, Volume2, VolumeX, Zap } from 'lucide-react';

function TestAI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const { playAlert } = useAlertSound();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const captureAndTest = async () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    try {
      const data = await aiService.detectFrame(imageData, 'test_session');
      console.log('AI Response:', data);
      setResult(data);
      
      // Play alert sound IMMEDIATELY for NEW threats
      if (data.threats_found > 0 && soundEnabled) {
        playAlert();
      }
      
      // ALWAYS add to history - even if no objects (for real-time updates)
      const newEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleString(),
        detections: data.detections || [],
        threats_found: data.threats_found || 0,
        total_objects: data.total_objects || (data.detections ? data.detections.length : 0)
      };
      setDetectionHistory(prev => [newEntry, ...prev.slice(0, 19)]);
    } catch (err) {
      setResult({ error: err.message });
    }
  };

  const testSound = () => {
    console.log('Testing alert sound...');
    playAlert();
  };

  const startContinuousMonitoring = () => {
    setIsMonitoring(true);
    intervalRef.current = setInterval(captureAndTest, 1000);
  };

  const stopContinuousMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            AI Detection Laboratory
          </h1>
          <p className="text-gray-300 text-lg">Real-time threat detection powered by YOLOv8</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Camera Feed */}
          <div className="xl:col-span-5">
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <Camera className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Live Camera Feed</h2>
              </div>
              
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full aspect-video bg-black rounded-xl border border-white/20" 
                  autoPlay 
                  muted 
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay controls */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3">
                  <button 
                    onClick={startCamera}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 backdrop-blur-sm rounded-full hover:bg-blue-700/80 transition-all duration-200 text-white font-medium"
                  >
                    <Camera size={18} />
                    <span>Start Camera</span>
                  </button>
                  
                  <button 
                    onClick={captureAndTest}
                    disabled={loading || isMonitoring}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600/80 backdrop-blur-sm rounded-full hover:bg-green-700/80 disabled:bg-gray-600/50 transition-all duration-200 text-white font-medium"
                  >
                    <Zap size={18} />
                    <span>Single Test</span>
                  </button>
                  
                  <button 
                    onClick={isMonitoring ? stopContinuousMonitoring : startContinuousMonitoring}
                    className={`flex items-center space-x-2 px-4 py-2 backdrop-blur-sm rounded-full transition-all duration-200 text-white font-medium ${
                      isMonitoring 
                        ? 'bg-red-600/80 hover:bg-red-700/80' 
                        : 'bg-purple-600/80 hover:bg-purple-700/80'
                    }`}
                  >
                    {isMonitoring ? <Square size={18} /> : <Play size={18} />}
                    <span>{isMonitoring ? 'Stop Monitor' : 'Start Monitor'}</span>
                  </button>
                </div>
              </div>

              {/* Control Panel */}
              <div className="mt-4 flex justify-center space-x-3">
                <button 
                  onClick={testSound}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-full hover:bg-yellow-600/30 transition-all duration-200 text-yellow-300 font-medium"
                >
                  <Volume2 size={18} />
                  <span>Test Sound</span>
                </button>
                
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    soundEnabled 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30' 
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-300 hover:bg-gray-500/30'
                  }`}
                >
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Detection */}
          <div className="xl:col-span-4">
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl h-full">
              <h2 className="text-xl font-bold text-white mb-4">Current Detection</h2>
              
              {isMonitoring && (
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-purple-600/30 border border-purple-500/50 text-purple-300 animate-pulse">
                    🔍 Live Monitoring Active
                  </span>
                </div>
              )}
              
              <div className="space-y-4">
                {result ? (
                  result.error ? (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <h3 className="font-bold mb-2 text-red-300">Error:</h3>
                      <p className="text-red-200">{result.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.threats_found > 0 
                            ? 'bg-red-500/30 border border-red-500/50 text-red-300' 
                            : 'bg-green-500/30 border border-green-500/50 text-green-300'
                        }`}>
                          {result.threats_found > 0 ? `⚠️ ${result.threats_found} Threats` : '✅ No Threats'}
                        </span>
                        {result.total_objects > 0 && (
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/30 border border-blue-500/50 text-blue-300">
                            📱 {result.total_objects} Objects
                          </span>
                        )}
                      </div>
                      
                      {result.detections && result.detections.length > 0 && (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {result.detections.map((detection, index) => {
                            const isThreat = ['knife', 'scissors', 'gun'].includes(detection.object);
                            return (
                              <div key={index} className={`p-3 rounded-xl border backdrop-blur-sm ${
                                isThreat 
                                  ? 'bg-red-500/20 border-red-500/30' 
                                  : 'bg-blue-500/20 border-blue-500/30'
                              }`}>
                                <div className="flex justify-between items-center">
                                  <span className={`font-bold ${
                                    isThreat ? 'text-red-200' : 'text-blue-200'
                                  }`}>
                                    {isThreat ? '⚠️' : '📱'} {detection.object.toUpperCase()}
                                  </span>
                                  <span className={`font-mono ${isThreat ? 'text-red-300' : 'text-blue-300'}`}>
                                    {Math.round(detection.confidence * 100)}%
                                  </span>
                                </div>
                                <div className={`text-xs mt-1 ${
                                  isThreat ? 'text-red-400' : 'text-blue-400'
                                }`}>
                                  {new Date(detection.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
                        Last scan: {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-gray-400 text-center py-8">Start monitoring to see live detection results</p>
                )}
              </div>
            </div>
          </div>

          {/* Detection History */}
          <div className="xl:col-span-3">
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl h-full">
              <h2 className="text-xl font-bold text-white mb-4">
                🚨 Detection History ({detectionHistory.length})
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {detectionHistory.length > 0 ? (
                  detectionHistory.map((entry) => (
                    <div key={entry.id} className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          {entry.threats_found > 0 && (
                            <span className="text-red-400 font-bold text-xs px-2 py-1 bg-red-500/20 rounded-full">
                              ⚠️ {entry.threats_found}
                            </span>
                          )}
                          <span className="text-blue-400 font-bold text-xs px-2 py-1 bg-blue-500/20 rounded-full">
                            📱 {entry.total_objects || entry.detections.length}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{entry.timestamp.split(',')[1]}</span>
                      </div>
                      
                      <div className="space-y-1">
                        {entry.detections.slice(0, 2).map((detection, idx) => {
                          const isThreat = ['knife', 'scissors', 'gun'].includes(detection.object);
                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className={isThreat ? 'text-red-300' : 'text-blue-300'}>
                                {isThreat ? '⚠️' : '📱'} {detection.object}
                              </span>
                              <span className={`font-mono ${isThreat ? 'text-red-200' : 'text-blue-200'}`}>
                                {Math.round(detection.confidence * 100)}%
                              </span>
                            </div>
                          );
                        })}
                        {entry.detections.length > 2 && (
                          <div className="text-xs text-gray-400">+{entry.detections.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No detections yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {detectionHistory.length > 0 && (
          <div className="mt-8">
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Detection Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                  <div className="text-2xl font-bold text-red-300">{detectionHistory.length}</div>
                  <div className="text-xs text-red-400">Total Scans</div>
                </div>
                <div className="text-center p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                  <div className="text-2xl font-bold text-orange-300">
                    {detectionHistory.reduce((sum, entry) => sum + entry.threats_found, 0)}
                  </div>
                  <div className="text-xs text-orange-400">Total Threats</div>
                </div>
                <div className="text-center p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-300">
                    {detectionHistory.reduce((sum, entry) => sum + entry.total_objects, 0)}
                  </div>
                  <div className="text-xs text-blue-400">Total Objects</div>
                </div>
                <div className="text-center p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <div className="text-2xl font-bold text-green-300">
                    {isMonitoring ? 'ACTIVE' : 'STOPPED'}
                  </div>
                  <div className="text-xs text-green-400">Status</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestAI;