import React from 'react';
import './index.css'; // This line imports your Tailwind styles
import Dashboard from './components/Dashboard';

function App() {
  // This wrapper ensures our dark mode and full-screen height are applied.
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Dashboard />
    </div>
  );
}

export default App;