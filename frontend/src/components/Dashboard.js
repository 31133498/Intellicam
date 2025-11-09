import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Not used for mock data, but keep for later
import StatusHeader from './StatusHeader';
import LiveFeed from './LiveFeed';
import AlertLog from './AlertLog';
import VisualizationPanel from './VisualizationPanel';
import CameraInputForm from './CameraInputForm';

// Mock data as requested
const MOCK_ALERTS_DATA = [
  { object: "person", confidence: 0.91 },
  { object: "knife", confidence: 0.82 },
  { object: "person", confidence: 0.75 },
  { object: "scissors", confidence: 0.95 },
  { object: "car", confidence: 0.60 },
];

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState("Idle"); // Statuses: Idle, Safe, Threat
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  // Mock implementation of the 'GET /api/alerts' polling
  useEffect(() => {
    if (!isMonitoring) {
      setAlerts([]); // Clear alerts when monitoring stops
      setStatus("Idle");
      return; // Stop polling
    }

    // This function simulates the live polling from the backend
    const pollAlerts = () => {
      // MOCK API CALL: axios.get("http://localhost:5000/api/alerts")
      console.log('MOCK: Polling GET /api/alerts');
      
      // Pick a random mock alert to simulate a new detection
      const newAlert = MOCK_ALERTS_DATA[Math.floor(Math.random() * MOCK_ALERTS_DATA.length)];
      const newAlertWithTimestamp = { 
        ...newAlert, 
        id: Date.now(), 
        timestamp: new Date().toISOString() 
      };

      // Add the new alert to the top of the log
      setAlerts(prevAlerts => [newAlertWithTimestamp, ...prevAlerts]);

      // Update status based on the new alert
      if (newAlertWithTimestamp.confidence > 0.7) {
        setStatus("Threat");
      } else {
        setStatus("Safe");
      }
    };

    // Start polling immediately, then every 3 seconds
    pollAlerts();
    const interval = setInterval(pollAlerts, 3000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isMonitoring]); // This effect re-runs whenever isMonitoring changes

  // Handlers for the CameraInputForm
  const handleStartMonitoring = (url) => {
    setStreamUrl(url);
    setIsMonitoring(true);
    setStatus("Connecting...");
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setStreamUrl('');
    setStatus("Idle");
  };

  return (
    <div className="flex flex-col h-screen">
      <StatusHeader status={status} />

      <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto">
        {/* Top Section: Input Form (new) */}
        <div className="lg:col-span-3">
          <CameraInputForm
            isMonitoring={isMonitoring}
            onStart={handleStartMonitoring}
            onStop={handleStopMonitoring}
          />
        </div>

        {/* Left Panel: Live Feed (now conditional) */}
        <div className="lg:col-span-2">
          <LiveFeed streamUrl={streamUrl} isMonitoring={isMonitoring} />
        </div>

        {/* Right Panel: Alert Log */}
        <div className="lg:col-span-1 h-[400px] lg:h-auto">
          <AlertLog alerts={alerts} />
        </div>

        {/* Bottom: Chart View */}
        <div className="lg:col-span-3">
          <VisualizationPanel alertData={alerts} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;