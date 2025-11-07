import React from 'react';
import { Bar } from 'react-chartjs-2';

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
      ticks: {
        color: '#9CA3AF', // Tailwind gray-400
        stepSize: 1,
      },
      grid: {
        color: '#4B5563', // Tailwind gray-600
      },
    },
    x: {
      ticks: {
        color: '#D1D5DB', // Tailwind gray-300
      },
      grid: {
        display: false,
      },
    },
  },
};

function ObjectFrequencyChart({ data }) {
  return <Bar options={options} data={data} />;
}

export default ObjectFrequencyChart;