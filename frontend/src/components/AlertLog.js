import React from 'react';

// Displays detection logs with timestamps
function AlertLog({ alerts }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2">Alert Log</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2">Object</th>
            <th className="py-2">Confidence</th>
            <th className="py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {/* We check if alerts exist before mapping */}
          {alerts && alerts.map((alert) => (
            <tr key={alert.id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className={`py-2 font-medium ${alert.confidence > 0.7 ? 'text-red-400' : ''}`}>
                {alert.object}
              </td>
              <td className="py-2">{(alert.confidence * 100).toFixed(0)}%</td>
              <td className="py-2 text-sm text-gray-400">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlertLog;