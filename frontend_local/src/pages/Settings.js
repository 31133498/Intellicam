import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Main Entrance', ip: '192.168.1.100', status: 'Connected' },
    { id: 2, name: 'Parking Lot', ip: '192.168.1.101', status: 'Connected' },
    { id: 3, name: 'Reception Area', ip: '192.168.1.102', status: 'Connected' }
  ]);
  
  const [newCamera, setNewCamera] = useState({ name: '', ip: '' });
  const [activeTab, setActiveTab] = useState('cameras');

  const addCamera = () => {
    if (newCamera.name && newCamera.ip) {
      setCameras([...cameras, {
        id: Date.now(),
        name: newCamera.name,
        ip: newCamera.ip,
        status: 'Connected'
      }]);
      setNewCamera({ name: '', ip: '' });
    }
  };

  const removeCamera = (id) => {
    setCameras(cameras.filter(cam => cam.id !== id));
  };

  const tabs = [
    { id: 'cameras', label: 'Camera Management' },
    { id: 'alerts', label: 'Alert Configuration' },
    { id: 'threats', label: 'Threat History' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'account', label: 'Account' }
  ];

  const threatHistory = [
    {
      id: 1,
      image: '/threat-images/knife1.jpg',
      threat: 'Knife',
      confidence: 94,
      timestamp: '2024-01-15 14:23:45',
      camera: 'Main Entrance',
      status: 'Critical'
    },
    {
      id: 2,
      image: '/threat-images/knife2.jpg',
      threat: 'Knife',
      confidence: 87,
      timestamp: '2024-01-15 09:15:22',
      camera: 'Reception Area',
      status: 'Critical'
    },
    {
      id: 3,
      image: '/threat-images/knife3.jpg',
      threat: 'Knife',
      confidence: 91,
      timestamp: '2024-01-14 16:42:18',
      camera: 'Parking Lot',
      status: 'Critical'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Settings</h1>
              <p className="text-sm text-slate-400">Manage your cameras, alerts, and account preferences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              Dashboard
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Camera Management */}
          {activeTab === 'cameras' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Camera Management</h2>
                <div className="text-sm text-slate-400">
                  Total Connected Cameras: <span className="text-blue-400 font-semibold">{cameras.length}</span>
                </div>
              </div>

              {/* Add Camera */}
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Add Camera</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Camera Name"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                    className="bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="IP Address"
                    value={newCamera.ip}
                    onChange={(e) => setNewCamera({...newCamera, ip: e.target.value})}
                    className="bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={addCamera} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add Camera
                  </button>
                </div>
              </div>

              {/* Connected Cameras */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Connected Cameras</h3>
                {cameras.map(camera => (
                  <div key={camera.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{camera.name}</h4>
                        <p className="text-slate-400 text-sm">{camera.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                        {camera.status}
                      </span>
                      <button 
                        onClick={() => removeCamera(camera.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert Configuration */}
          {activeTab === 'alerts' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Alert Configuration</h2>
              <div className="space-y-4">
                {[
                  { label: 'Weapon Detection Alerts', enabled: true },
                  { label: 'Person Detection Alerts', enabled: true },
                  { label: 'Sound Alerts', enabled: true },
                  { label: 'Motion Detection', enabled: false }
                ].map((alert, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <label className="flex items-center justify-between">
                      <span className="text-white font-medium">{alert.label}</span>
                      <input type="checkbox" defaultChecked={alert.enabled} className="w-5 h-5 text-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threat History */}
          {activeTab === 'threats' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Threat Detection History</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {threatHistory.map(threat => (
                  <div key={threat.id} className="bg-slate-700 rounded-lg p-4 border-l-4 border-red-500">
                    <div className="mb-3">
                      <img 
                        src={threat.image} 
                        alt={`Threat detected: ${threat.threat}`}
                        className="w-full h-32 object-cover rounded-lg bg-slate-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-32 bg-slate-600 rounded-lg items-center justify-center text-slate-400 text-sm" style={{display: 'none'}}>
                        Image: {threat.image.split('/').pop()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 font-semibold">{threat.threat.toUpperCase()}</span>
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                          {threat.status}
                        </span>
                      </div>
                      <p className="text-white text-sm">
                        Confidence: <span className="font-semibold">{threat.confidence}%</span>
                      </p>
                      <p className="text-slate-400 text-xs">
                        Camera: {threat.camera}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {threat.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Detection Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-red-400">{threatHistory.length}</p>
                    <p className="text-slate-400 text-sm">Total Threats</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">91%</p>
                    <p className="text-slate-400 text-sm">Avg Confidence</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">24h</p>
                    <p className="text-slate-400 text-sm">Last Detection</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', enabled: true },
                  { label: 'SMS Alerts', enabled: false },
                  { label: 'Push Notifications', enabled: true },
                  { label: 'Desktop Notifications', enabled: true }
                ].map((notification, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <label className="flex items-center justify-between">
                      <span className="text-white font-medium">{notification.label}</span>
                      <input type="checkbox" defaultChecked={notification.enabled} className="w-5 h-5 text-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account */}
          {activeTab === 'account' && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">Username</label>
                  <input type="text" defaultValue="admin" className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input type="email" defaultValue="admin@intellicam.com" className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <label className="block text-white font-medium mb-2">Change Password</label>
                  <input type="password" placeholder="New Password" className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;