import React from 'react';
import ObjectFrequencyChart from './ObjectFrequencyChart';
import ConfidenceTrendChart from './ConfidenceTrendChart';

// --- NOTE: We have REMOVED the chart.js imports and ChartJS.register()
// from this file, as it is now handled globally in src/index.js ---

function VisualizationPanel({ alertData }) {
  // Process data for "Most Frequent Object Types"
  const objectCounts = alertData.reduce((acc, alert) => {
    acc[alert.object] = (acc[alert.object] || 0) + 1;
    return acc;
  }, {});

  const frequencyData = {
    labels: Object.keys(objectCounts),
    datasets: [
      {
        label: 'Detections',
        data: Object.values(objectCounts),
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red for threats
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Process data for "Confidence Trend"
  const confidenceData = {
    labels: alertData.map((_, index) => `Alert ${index + 1}`).reverse(), // Show newest alerts on the right
    datasets: [
      {
        label: 'Confidence',
        data: alertData.map(alert => alert.confidence).reverse(),
        fill: false,
        borderColor: 'rgba(59, 130, 246, 0.8)', // Blue for info
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold mb-4">Detection Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 2: Most frequent object types */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Detection Frequency</h3>
          <ObjectFrequencyChart data={frequencyData} />
        </div>
        {/* Chart 3: Confidence trend */}
        <div className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Confidence Trend</h3>
          <ConfidenceTrendChart data={confidenceData} />
        </div>
      </div>
    </div>
  );
}

export default VisualizationPanel;