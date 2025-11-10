import React, { useEffect } from 'react';

function AlertPopup({ alert, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!alert) return null;

  // const isHighThreat = ['knife', 'gun', 'scissors'].includes(alert.object_type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-red-600 rounded-lg shadow-2xl p-6 min-w-96 border-4 border-red-400 animate-pulse">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            ⚠️ SECURITY ALERT ⚠️
          </h3>
          <p className="text-xl font-semibold text-white mb-2">
            {alert.object_type.toUpperCase()}
          </p>
          <p className="text-white mb-4">
            Confidence: {Math.round(alert.confidence * 100)}%
          </p>
          <p className="text-white/80 text-sm mb-6">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
          <button
            onClick={onClose}
            className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;