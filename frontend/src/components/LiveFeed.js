import React from 'react';

// Displays the live camera feed, but only if monitoring is active
function LiveFeed({ streamUrl, isMonitoring }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full">
      <h2 className="text-xl font-semibold mb-2">Live Feed</h2>
      <div className="bg-black aspect-video rounded overflow-hidden flex items-center justify-center">
        {isMonitoring && streamUrl ? (
          <img
            src={streamUrl}
            alt="Live Camera Feed"
            className="w-full h-full object-cover"
            // In a real build, we'd add a proper error handler here
            onError={(e) => { 
              e.target.style.display = 'none'; 
              // We could show a "Stream Failed" message
            }}
          />
        ) : (
          <p className="text-gray-400">Monitoring is Idle</p>
        )}
              </div>
    </div>
  );
}

export default LiveFeed;