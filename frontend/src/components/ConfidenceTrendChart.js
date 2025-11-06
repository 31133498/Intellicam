import React from 'react';
import { Line } from 'react-chartjs-2';

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1.0, // Confidence is 0.0 to 1.0
      ticks: {
        color: '#9CA3AF',
      },
      grid: {
        color: '#4B5563',
      },
    },
    x: {
      ticks: {
        color: '#D1D5DB',
      },
      grid: {
        display: false,
      },
    },
  },
};

function ConfidenceTrendChart({ data }) {
  return <Line options={options} data={data} />;
}

export default ConfidenceTrendChart;