import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import aiService from '../services/aiService';
import { useAlertSound } from '../hooks/useAlertSound';

function TestAI() {
  const [result, setResult] = useState(null);
  const [loading] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playAlert } = useAlertSound();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const testSound = () => {
    console.log('Testing alert sound...');
    playAlert();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      setResult(data);
      
      if (data.threats_found > 0 && soundEnabled) {
        playAlert();
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-slate-900/20"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center border border-blue-500/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">
                INTELLICAM AI DETECTION
              </h1>
              <p className="text-slate-400">Advanced Threat Detection System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/40 transition-all duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-900/40 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Live Camera Feed</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                <span className={`text-sm font-medium ${isMonitoring ? 'text-green-400' : 'text-slate-400'}`}>
                  {isMonitoring ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
            </div>

            <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-6 border border-slate-700/30" style={{aspectRatio: '16/9'}}>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={startCamera}
                  className="px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-all duration-200 font-medium"
                >
                  Start Camera
                </button>
                <button 
                  onClick={captureAndTest}
                  disabled={loading || isMonitoring}
                  className="px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 disabled:bg-slate-700/30 disabled:text-slate-500 transition-all duration-200 font-medium"
                >
                  Single Test
                </button>
                <button 
                  onClick={isMonitoring ? stopContinuousMonitoring : startContinuousMonitoring}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                    isMonitoring 
                      ? 'bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30' 
                      : 'bg-purple-600/20 border-purple-500/30 text-purple-300 hover:bg-purple-600/30'
                  }`}
                >
                  {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
                </button>
                <button 
                  onClick={testSound}
                  className="px-4 py-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-all duration-200 font-medium"
                >
                  Test Sound
                </button>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6H7a1 1 0 01-1-1v-4a1 1 0 011-1h2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Alert Sound</p>
                    <p className="text-slate-400 text-sm">Play sound when threats detected</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Detection Results */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Detection Results</h3>

            {/* Current Detection */}
            {result && result.threats_found > 0 && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-300 font-semibold text-sm">THREAT DETECTED</span>
                </div>
                <p className="text-white font-medium">
                  {result.detections?.filter(d => ['knife', 'scissors', 'gun'].includes(d.object))[0]?.object}
                </p>
                <p className="text-slate-300 text-sm">
                  Confidence: {result.detections?.filter(d => ['knife', 'scissors', 'gun'].includes(d.object))[0] ? 
                    (result.detections.filter(d => ['knife', 'scissors', 'gun'].includes(d.object))[0].confidence * 100).toFixed(1) : 0}%
                </p>
              </div>
            )}

            {/* Detection History */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {detectionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-slate-600/30">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No detections yet</p>
                  <p className="text-slate-500 text-xs mt-1">Start monitoring to begin</p>
                </div>
              ) : (
                detectionHistory.map((entry) => (
                  <div key={entry.id} className={`p-3 rounded-lg border ${
                    entry.threats_found > 0 
                      ? 'bg-red-900/20 border-red-700/30' 
                      : 'bg-blue-900/20 border-blue-700/30'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="space-x-2">
                        {entry.threats_found > 0 && (
                          <span className="text-red-300 font-bold text-xs">
                            {entry.threats_found} Threat{entry.threats_found > 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="text-blue-300 font-bold text-xs">
                          {entry.total_objects} Objects
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {entry.detections.slice(0, 3).map((detection, idx) => {
                        const isThreat = ['knife', 'scissors', 'gun'].includes(detection.object);
                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className={isThreat ? 'text-red-300' : 'text-blue-300'}>
                              {detection.object.toUpperCase()}
                            </span>
                            <span className={isThreat ? 'text-red-200' : 'text-blue-200'}>
                              {Math.round(detection.confidence * 100)}%
                            </span>
                          </div>
                        );
                      })}
                      {entry.detections.length > 3 && (
                        <div className="text-xs text-slate-400">+{entry.detections.length - 3} more...</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Clear History */}
            {detectionHistory.length > 0 && (
              <button
                onClick={() => setDetectionHistory([])}
                className="w-full mt-4 px-4 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/40 transition-all duration-200 text-sm"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {detectionHistory.length > 0 && (
          <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detection Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-700/30 text-center">
                <div className="text-2xl font-bold text-white">{detectionHistory.length}</div>
                <div className="text-xs text-slate-400">Total Scans</div>
              </div>
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/30 text-center">
                <div className="text-2xl font-bold text-red-300">
                  {detectionHistory.reduce((sum, entry) => sum + entry.threats_found, 0)}
                </div>
                <div className="text-xs text-red-400">Threats Found</div>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30 text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {detectionHistory.reduce((sum, entry) => sum + entry.total_objects, 0)}
                </div>
                <div className="text-xs text-blue-400">Objects Detected</div>
              </div>
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30 text-center">
                <div className="text-2xl font-bold text-green-300">
                  {isMonitoring ? 'ACTIVE' : 'STOPPED'}
                </div>
                <div className="text-xs text-green-400">System Status</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestAI;