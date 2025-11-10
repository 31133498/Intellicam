import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatusHeader from './StatusHeader';
import LiveFeed from './LiveFeed';
import AlertLog from './AlertLog';
import VisualizationPanel from './VisualizationPanel';
import CameraInputForm from './CameraInputForm';
import Chatbot from './Chatbot';
import UserProfile from './UserProfile';
import { useAlertSound } from '../hooks/useAlertSound';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user } = useAuth();
  const { playAlert } = useAlertSound();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isMonitoring) {
      setStatus("Idle");
    } else {
      setStatus("Monitoring Active");
    }
  }, [isMonitoring]);

  const handleStartMonitoring = (videoStreamUrl) => {
    setStreamUrl(videoStreamUrl);
    setIsMonitoring(true);
    setStatus("Monitoring Active");
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setStreamUrl('');
    setStatus("Idle");
  };

  const handleDetection = (detection) => {
    const newAlert = {
      id: Date.now(),
      object_type: detection.object,
      confidence: detection.confidence,
      timestamp: detection.timestamp,
      session_id: detection.session_id || 'demo',
      bbox: detection.bbox
    };
    
    setAlerts(prevAlerts => {
      const updated = [newAlert, ...prevAlerts];
      // Store in localStorage for AI Copilot
      localStorage.setItem('intellicam_events', JSON.stringify(updated.slice(0, 100)));
      return updated;
    });
    
    if (detection.confidence > 0.7) {
      setStatus("Threat Detected!");
      if (soundEnabled) {
        playAlert();
      }
    } else {
      setStatus("Monitoring Active");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-slate-900/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50 p-3 md:p-4 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center border border-blue-500/30">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">INTELLICAM</h1>
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Security Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isMonitoring ? 'bg-green-400' : 'bg-slate-500'
                }`}></div>
                <span className="text-sm font-medium text-white">
                  {isMonitoring ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm border transition-all duration-200 ${
                  soundEnabled 
                    ? 'bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30' 
                    : 'bg-slate-600/20 border-slate-500/30 text-slate-300 hover:bg-slate-600/30'
                }`}
              >
                <span>{soundEnabled ? '🔊' : '🔇'}</span>
                <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </button>
              <button
                onClick={() => navigate('/ai-copilot')}
                className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm border bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-all duration-200"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">AI Copilot</span>
                <span className="sm:hidden">AI</span>
              </button>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="relative z-10 overflow-y-auto">
        {/* Welcome Section */}
        <div className="p-3 md:p-6">
          <div className="mb-4 md:mb-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-4 md:p-6 rounded-xl">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
              <p className="text-sm md:text-base text-slate-400">Advanced AI-powered security monitoring and threat detection system</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{alerts.length}</p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18C1.64486 18.3024 1.55625 18.6453 1.56518 18.9928C1.57412 19.3403 1.68033 19.6781 1.87309 19.9725C2.06584 20.2669 2.33797 20.5068 2.65655 20.6675C2.97513 20.8281 3.32794 20.9041 3.68 20.89H20.32C20.6721 20.9041 21.0249 20.8281 21.3435 20.6675C21.662 20.5068 21.9342 20.2669 22.1269 19.9725C22.3197 19.6781 22.4259 19.3403 22.4348 18.9928C22.4437 18.6453 22.3551 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Cameras</p>
                  <p className="text-2xl font-bold text-blue-400">{isMonitoring ? 1 : 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Currently monitoring</p>
                </div>
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Detection Rate</p>
                  <p className="text-2xl font-bold text-green-400">98.5%</p>
                  <p className="text-xs text-slate-500 mt-1">Accuracy score</p>
                </div>
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Status</p>
                  <p className={`text-xl font-bold ${
                    status === 'Threat Detected!' ? 'text-red-400' : 
                    isMonitoring ? 'text-green-400' : 'text-slate-400'
                  }`}>{status}</p>
                  <p className="text-xs text-slate-500 mt-1">Current state</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === 'Threat Detected!' ? 'bg-red-600/20' : 
                  isMonitoring ? 'bg-green-600/20' : 'bg-slate-600/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'Threat Detected!' ? 'bg-red-400 animate-pulse' : 
                    isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-slate-400'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="p-3 md:p-6 space-y-4 md:space-y-6">
          {/* Camera Input */}
          <div className="mb-4 md:mb-6">
            <CameraInputForm
              isMonitoring={isMonitoring}
              onStart={handleStartMonitoring}
              onStop={handleStopMonitoring}
            />
          </div>

          {/* Live Feed and Alert Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="lg:col-span-2">
              <LiveFeed 
                streamUrl={streamUrl} 
                isMonitoring={isMonitoring} 
                onDetection={handleDetection}
              />
            </div>

            <div className="lg:col-span-1">
              {loading ? (
                <p className="text-slate-400">Loading alerts...</p>
              ) : (
                <AlertLog alerts={alerts} />
              )}
            </div>
          </div>

          {/* Visualization */}
          <div className="mb-4 md:mb-6">
            <VisualizationPanel alertData={alerts} />
          </div>
        </main>

        <Chatbot alerts={alerts} />
      </div>
    </div>
  );
}

export default Dashboard;