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
    setInput('');
    setLoading(true);

    try {
      const response = await AICopilotService.chat(input, eventLogs);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-slate-900/20"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center border border-blue-500/30">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">INTELLICAM AI COPILOT</h1>
                <p className="text-xs md:text-sm text-slate-400 hidden sm:block">Security Intelligence Officer</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-2 py-1 md:px-4 md:py-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/40 transition-all duration-200 text-sm"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-2 py-1 md:px-4 md:py-2 bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-900/40 transition-all duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-3 md:p-6">
          <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-6 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-full md:max-w-3xl p-3 md:p-4 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100' 
                      : 'bg-slate-700/40 border border-slate-600/30 text-white'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-blue-300">AI COPILOT</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/40 border border-slate-600/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
                      <span className="text-slate-300 ml-2">AI Copilot is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-3">Quick Questions:</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-2 md:p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-slate-700/40 transition-all duration-200 text-xs md:text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about security events, threats, or get recommendations..."
                className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm md:text-base"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 py-2 md:px-6 md:py-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm md:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICopilot;