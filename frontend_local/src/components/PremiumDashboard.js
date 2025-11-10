import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeCameras: 0,
    totalAlerts: 0,
    threatsDetected: 0,
    systemUptime: '99.9%'
  });

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeCameras: Math.floor(Math.random() * 5) + 1,
        totalAlerts: prev.totalAlerts + Math.floor(Math.random() * 2),
        threatsDetected: prev.threatsDetected + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToAI = () => {
    navigate('/test-ai');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-slate-900/20"></div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30 animation-delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-35 animation-delay-2000"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center border border-blue-500/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">INTELLICAM</h1>
              <p className="text-slate-400 text-sm">Security Intelligence Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-white font-medium">{user?.fullName || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/40 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Cameras</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.activeCameras}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none">
                  <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Alerts</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Threats Detected</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.threatsDetected}</p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.29 3.86L1.82 18C1.64486 18.3024 1.55625 18.6453 1.56518 18.9928C1.57412 19.3403 1.68033 19.6781 1.87309 19.9725C2.06584 20.2669 2.33797 20.5068 2.65655 20.6675C2.97513 20.8281 3.32794 20.9041 3.68 20.89H20.32C20.6721 20.9041 21.0249 20.8281 21.3435 20.6675C21.662 20.5068 21.9342 20.2669 22.1269 19.9725C22.3197 19.6781 22.4259 19.3403 22.4348 18.9928C22.4437 18.6453 22.3551 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="17" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">System Uptime</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.systemUptime}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Detection Panel */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">AI Detection System</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">ACTIVE</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-600/30">
                <h3 className="text-white font-medium mb-2">Detection Capabilities</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Weapon Detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Person Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Vehicle Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">Threat Assessment</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={navigateToAI}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 border border-blue-500/30"
              >
                Launch AI Detection Interface
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">System Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-600/30">
                <span className="text-slate-300 text-sm">AI Engine</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs font-medium">ONLINE</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-600/30">
                <span className="text-slate-300 text-sm">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs font-medium">CONNECTED</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-600/30">
                <span className="text-slate-300 text-sm">Alert System</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs font-medium">READY</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-600/30">
                <span className="text-slate-300 text-sm">Network</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs font-medium">STABLE</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <h3 className="text-blue-300 font-medium text-sm mb-2">Security Level</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="text-blue-300 text-sm font-medium">HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;