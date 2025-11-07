import React from 'react';

function StatusHeader({ status }) {
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
    <header className={`w-full p-4 text-white text-center shadow-lg ${getStatusColor()} transition-colors`}>
      <h1 className="text-2xl font-bold">Intellicam Dashboard</h1>
      <p className="text-lg">System Status: <span className="font-semibold uppercase">{status}</span></p>
    </header>
  );
}

export default StatusHeader;