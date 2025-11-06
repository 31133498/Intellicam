import React, { useState } from 'react';
// eslint-disable-next-line
import axios from 'axios';

// This component handles the user input for the camera URL
// and the Start/Stop monitoring buttons.
function CameraInputForm({ isMonitoring, onStart, onStop }) {
  const [cameraUrl, setCameraUrl] = useState('http://192.168.x.x:8080/video');

  const handleStart = () => {
    // MOCK: This fulfills the 'POST /api/start-monitoring' requirement
    // In a real app: axios.post('/api/start-monitoring', { camera_url: cameraUrl });
    console.log('MOCK: POST /api/start-monitoring with URL:', cameraUrl);
    onStart(cameraUrl);
  };

  const handleStop = () => {
    // MOCK: This fulfills the 'POST /api/stop-monitoring' requirement
    // In a real app: axios.post('/api/stop-monitoring');
    console.log('MOCK: POST /api/stop-monitoring');
    onStop();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner mb-4">
      <h2 className="text-xl font-semibold mb-2">Monitoring Control</h2>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={cameraUrl}
          onChange={(e) => setCameraUrl(e.target.value)}
          placeholder="Enter IP Camera URL (e.g., http://.../video)"
          className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isMonitoring}
        />
        {!isMonitoring ? (
          <button
            onClick={handleStart}
            className="p-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Start Monitoring
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="p-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            Stop Monitoring
          </button>
        )}
      </div>
    </div>
  );
}

export default CameraInputForm;