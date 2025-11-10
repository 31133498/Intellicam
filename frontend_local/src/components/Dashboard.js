import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import LiveFeed from './LiveFeed';
import AlertLog from './AlertLog';
import VisualizationPanel from './VisualizationPanel';
import CameraInputForm from './CameraInputForm';
import Chatbot from './Chatbot';
import UserProfile from './UserProfile';
import AlertPopup from './AlertPopup';
import { useAlertSound } from '../hooks/useAlertSound';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentAlert, setCurrentAlert] = useState(null);
  const { user } = useAuth();
  const { playAlert, stopAlert } = useAlertSound();
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
    setCurrentAlert(null); // Clear any active popup
    stopAlert(); // Stop any playing sound
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
    
    // Show alert popup
    setCurrentAlert(newAlert);
    
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
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">INTELLICAM</h1>
              <p className="text-sm text-slate-400">Security Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-semibold text-white">
                  {isMonitoring ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-2 rounded-lg transition-colors ${soundEnabled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-600 text-slate-400 hover:bg-slate-700'}`}
              >
                <span>{soundEnabled ? '🔊' : '🔇'}</span>
                <span className="hidden sm:inline ml-2">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </button>
              <button
                onClick={() => navigate('/ai-copilot')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline ml-2">AI Copilot</span>
                <span className="sm:hidden ml-1">AI</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                <span>⚙️</span>
                <span className="hidden sm:inline ml-2">Settings</span>
              </button>
            </div>
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="overflow-y-auto">
        {/* Welcome Section */}
        <div className="p-3 md:p-6 animate-fade-in">
          <div className="mb-4 md:mb-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1 text-white">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
                  <p className="text-sm md:text-base text-slate-400 font-medium">Advanced AI-powered security monitoring and threat detection system</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold">Total Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{alerts.length}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">All time</p>
                </div>
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18C1.64486 18.3024 1.55625 18.6453 1.56518 18.9928C1.57412 19.3403 1.68033 19.6781 1.87309 19.9725C2.06584 20.2669 2.33797 20.5068 2.65655 20.6675C2.97513 20.8281 3.32794 20.9041 3.68 20.89H20.32C20.6721 20.9041 21.0249 20.8281 21.3435 20.6675C21.662 20.5068 21.9342 20.2669 22.1269 19.9725C22.3197 19.6781 22.4259 19.3403 22.4348 18.9928C22.4437 18.6453 22.3551 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="card-hover p-4 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold">Active Cameras</p>
                  <p className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{isMonitoring ? 1 : 0}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Currently monitoring</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="card-hover p-4 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold">Detection Rate</p>
                  <p className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">98.5%</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Accuracy score</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="card-hover p-4 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold">Status</p>
                  <p className={`text-xl font-bold transition-colors ${
                    status === 'Threat Detected!' ? 'text-red-400 group-hover:text-red-300' : 
                    isMonitoring ? 'text-green-400 group-hover:text-green-300' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>{status}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Current state</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300 ${
                  status === 'Threat Detected!' ? 'bg-gradient-to-br from-red-600/20 to-red-700/20' : 
                  isMonitoring ? 'bg-gradient-to-br from-green-600/20 to-green-700/20' : 'bg-gradient-to-br from-slate-600/20 to-slate-700/20'
                }`}>
                  <div className={status === 'Threat Detected!' ? 'status-danger' : isMonitoring ? 'status-online' : 'status-offline'}></div>
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
        <AlertPopup 
          alert={currentAlert} 
          onClose={() => setCurrentAlert(null)} 
        />
      </div>
    </div>
  );
}

export default Dashboard;