import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; // This line imports your Tailwind styles
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './components/Dashboard';
import TestAI from './pages/TestAI';
import Demo from './pages/Demo';
import AICopilot from './pages/AICopilot';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  // This wrapper ensures our dark mode and full-screen height are applied.
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/test-ai" element={<TestAI />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/ai-copilot" element={<AICopilot />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
