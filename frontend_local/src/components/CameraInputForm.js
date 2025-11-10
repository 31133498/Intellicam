import React, { useState } from 'react';

function CameraInputForm({ isMonitoring, onStart, onStop }) {
  const [cameraUrl, setCameraUrl] = useState('http://10.162.218.193:8080/video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraMode, setCameraMode] = useState('webcam'); // 'webcam' or 'ip'

  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      if (cameraMode === 'webcam') {
        onStart('webcam');
      } else {
        onStart(cameraUrl);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to start monitoring';
      setError(errorMsg);
      console.error("Error starting monitoring:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setError('');

    try {
      onStop();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to stop monitoring';
      setError(errorMsg);
      console.error("Error stopping monitoring:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely render the error message
  const renderError = () => {
    if (!error) return null;
    if (typeof error === 'object' && error.message) {
      return (
        <>
          <strong>{error.error}</strong>: {error.message}
        </>
      );
    }
    return String(error);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner mb-4">
      <h2 className="text-xl font-semibold mb-2">Monitoring Control</h2>
      
      {error && (
        <div className="bg-red-800 text-red-100 p-2 rounded mb-2">
          {renderError()}
        </div>
      )}

      {/* Camera Mode Selection */}
      <div className="mb-4">
        <div className="flex gap-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="webcam"
              checked={cameraMode === 'webcam'}
              onChange={(e) => setCameraMode(e.target.value)}
              disabled={isMonitoring || loading}
              className="mr-2"
            />
            <span className="text-white">📹 Use Webcam (Demo)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="ip"
              checked={cameraMode === 'ip'}
              onChange={(e) => setCameraMode(e.target.value)}
              disabled={isMonitoring || loading}
              className="mr-2"
            />
            <span className="text-white">🌐 IP Camera</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        {cameraMode === 'ip' && (
          <input
            type="text"
            value={cameraUrl}
            onChange={(e) => setCameraUrl(e.target.value)}
            placeholder="Enter IP Camera URL (e.g., http://.../video)"
            className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isMonitoring || loading}
          />
        )}
        {cameraMode === 'webcam' && (
          <div className="flex-grow p-2 rounded bg-blue-900/30 text-blue-200 border border-blue-600">
            📹 Webcam will be activated for live demo
          </div>
        )}
        {!isMonitoring ? (
          <button
            onClick={handleStart}
            disabled={loading}
            className="p-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:bg-gray-500"
          >
            {loading ? 'Starting...' : `Start ${cameraMode === 'webcam' ? 'Webcam' : 'IP Camera'}`}
          </button>
        ) : (
          <button
            onClick={handleStop}
            disabled={loading}
            className="p-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:bg-gray-500"
          >
            {loading ? 'Stopping...' : 'Stop Monitoring'}
          </button>
        )}
      </div>
    </div>
  );
}

export default CameraInputForm;