import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function StatusHeader({ status }) {
  const { user, logout } = useAuth();

  const getStatusColor = () => {
    switch (status) {
      case 'Threat':
        return 'bg-red-600 animate-pulse';
      case 'Safe':
        return 'bg-green-600';
      case 'Connecting...':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-600'; // Idle or Offline
    }
  };

  return (
    <header className={`w-full p-4 text-white shadow-lg ${getStatusColor()} transition-colors`}>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold">Intellicam Dashboard</h1>
          <p className="text-lg">System Status: <span className="font-semibold uppercase">{status}</span></p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm">
              Welcome, {user.email}
            </span>
          )}
          <button
            onClick={logout}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default StatusHeader;