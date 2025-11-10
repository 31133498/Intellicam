import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AICopilotService from '../services/aiCopilotService';

function AICopilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [eventLogs, setEventLogs] = useState([]);
  const messagesEndRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load event logs from localStorage
    const logs = JSON.parse(localStorage.getItem('intellicam_events') || '[]');
    setEventLogs(logs);
    
    // Welcome message
    setMessages([{
      id: 1,
      type: 'ai',
      content: 'Hello! I am INTELLICAM AI COPILOT, your security intelligence officer. I have access to all detection events from the last 2 hours. How can I assist you with security analysis today?',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await AICopilotService.chat(currentInput, eventLogs);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response || 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I\'m experiencing technical difficulties. Please check your connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What threats were detected in the last 2 hours?",
    "Show me security recommendations",
    "Analyze recent detection patterns",
    "What is the current threat level?"
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">AI Copilot</h1>
                <p className="text-sm text-slate-400">Security Intelligence Officer</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Chat Area */}
        <div className="flex-1 flex flex-col p-3 md:p-6 animate-fade-in">
          <div className="flex-1 bg-slate-800 rounded-lg p-6 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] max-h-[60vh]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`}>
                  <div className={`max-w-full md:max-w-3xl p-3 md:p-4 rounded-xl shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 text-blue-100' 
                      : 'glass-dark border border-slate-600/30 text-white'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-glow">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm font-semibold gradient-text">AI COPILOT</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap font-medium">{message.content}</p>
                    <div className="text-xs text-slate-400 mt-3 font-medium">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="glass-dark border border-slate-600/30 p-4 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <span className="text-slate-300 font-medium">AI Copilot is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Enhanced Quick Questions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-3 font-semibold">Quick Questions:</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-3 md:p-4 glass-dark border border-slate-600/30 rounded-xl text-slate-300 hover:bg-slate-700/20 hover:text-white transition-all duration-200 text-xs md:text-sm font-medium transform hover:scale-[1.02]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Input Area */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about security events, threats, or get recommendations..."
                className="input-primary flex-1"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span>Send</span>
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICopilot;