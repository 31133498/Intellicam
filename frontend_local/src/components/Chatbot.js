import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

function Chatbot({ alerts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your IntelliCam assistant. Ask me questions about alerts, like 'is there anything suspicious from 2-4 pm?'", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    // Mock AI response based on alerts data
    const response = generateResponse(input, alerts);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 500);

    setInput('');
  };

  const generateResponse = (query, alerts) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('suspicious') && lowerQuery.includes('2-4 pm')) {
      // Filter alerts between 2-4 PM
      const suspiciousAlerts = alerts.filter(alert => {
        const hour = new Date(alert.timestamp).getHours();
        return hour >= 14 && hour < 16 && alert.confidence > 0.7;
      });

      if (suspiciousAlerts.length > 0) {
        return `Yes, I detected ${suspiciousAlerts.length} suspicious activities between 2-4 PM: ${suspiciousAlerts.map(a => `${a.object} (${(a.confidence * 100).toFixed(1)}%)`).join(', ')}.`;
      } else {
        return "No suspicious activities detected between 2-4 PM.";
      }
    }

    if (lowerQuery.includes('alerts') || lowerQuery.includes('detections')) {
      const totalAlerts = alerts.length;
      const highConfidence = alerts.filter(a => a.confidence > 0.8).length;
      return `I have ${totalAlerts} total alerts, with ${highConfidence} high-confidence detections.`;
    }

    if (lowerQuery.includes('status') || lowerQuery.includes('system')) {
      return "The surveillance system is currently active and monitoring for threats.";
    }

    return "I'm here to help with questions about alerts and system status. Try asking about suspicious activities or recent detections!";
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-lg transition-colors duration-200 z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-gray-800 rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold">IntelliCam Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about alerts..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
