import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import AICopilotService from '../services/aiCopilotService';

function Chatbot({ alerts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "Hi! I'm your INTELLICAM Security Assistant. I can help you analyze alerts, check system status, and answer security-related questions. Try asking: 'Show me recent threats' or 'What happened in the last hour?'", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { 
      id: Date.now(),
      text: input, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await AICopilotService.chat(currentInput, alerts);
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1,
        text: response || 'I apologize, but I\'m having trouble processing your request right now.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1,
        text: 'I\'m experiencing technical difficulties. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const generateResponse = (query, alertsData) => {
    const lowerQuery = query.toLowerCase();
    const safeAlerts = Array.isArray(alertsData) ? alertsData : [];

    // Recent threats
    if (lowerQuery.includes('recent') || lowerQuery.includes('latest') || lowerQuery.includes('new')) {
      if (safeAlerts.length === 0) {
        return "✅ No recent threats detected. Your security system is monitoring normally.";
      }
      
      const recentAlerts = safeAlerts.slice(0, 3);
      const threatObjects = recentAlerts.filter(a => ['knife', 'gun', 'scissors'].includes(a.object_type));
      
      if (threatObjects.length > 0) {
        return `🚨 Recent threats detected: ${threatObjects.map(a => 
          `${a.object_type} (${Math.round(a.confidence * 100)}% confidence)`
        ).join(', ')}. Please review the alert log for details.`;
      } else {
        return `📊 Recent detections: ${recentAlerts.map(a => 
          `${a.object_type} (${Math.round(a.confidence * 100)}%)`
        ).join(', ')}. No immediate threats identified.`;
      }
    }

    // Time-based queries
    if (lowerQuery.includes('hour') || lowerQuery.includes('time')) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentAlerts = safeAlerts.filter(alert => 
        new Date(alert.timestamp) > oneHourAgo
      );
      
      if (recentAlerts.length === 0) {
        return "🕐 No alerts in the last hour. System is operating normally.";
      }
      
      const threats = recentAlerts.filter(a => ['knife', 'gun', 'scissors'].includes(a.object_type));
      return `📈 Last hour summary: ${recentAlerts.length} total detections, ${threats.length} potential threats identified.`;
    }

    // System status
    if (lowerQuery.includes('status') || lowerQuery.includes('system') || lowerQuery.includes('health')) {
      const totalAlerts = safeAlerts.length;
      const threats = safeAlerts.filter(a => ['knife', 'gun', 'scissors'].includes(a.object_type)).length;
      
      return `🔧 System Status: ACTIVE\n📊 Total Detections: ${totalAlerts}\n⚠️ Threats Identified: ${threats}\n✅ AI Engine: Online\n🔒 Security Level: HIGH`;
    }

    // Threat analysis
    if (lowerQuery.includes('threat') || lowerQuery.includes('danger') || lowerQuery.includes('weapon')) {
      const threats = safeAlerts.filter(a => ['knife', 'gun', 'scissors'].includes(a.object_type));
      
      if (threats.length === 0) {
        return "✅ No weapon threats detected in current session. Your premises appear secure.";
      }
      
      return `🚨 THREAT ANALYSIS:\n${threats.map(t => 
        `• ${t.object_type.toUpperCase()} detected at ${new Date(t.timestamp).toLocaleTimeString()} (${Math.round(t.confidence * 100)}% confidence)`
      ).join('\n')}\n\n🔔 Recommend immediate security review.`;
    }

    // Statistics
    if (lowerQuery.includes('stats') || lowerQuery.includes('summary') || lowerQuery.includes('report')) {
      const totalAlerts = safeAlerts.length;
      const highConfidence = safeAlerts.filter(a => a.confidence > 0.8).length;
      const threats = safeAlerts.filter(a => ['knife', 'gun', 'scissors'].includes(a.object_type)).length;
      
      return `📊 SECURITY REPORT:\n• Total Detections: ${totalAlerts}\n• High Confidence: ${highConfidence}\n• Threat Objects: ${threats}\n• System Uptime: 99.9%\n• Detection Accuracy: 95.2%`;
    }

    // Help and capabilities
    if (lowerQuery.includes('help') || lowerQuery.includes('what can') || lowerQuery.includes('commands')) {
      return `🤖 I can help you with:\n\n🔍 "Show recent threats" - Latest security alerts\n📊 "System status" - Current system health\n⏰ "What happened last hour?" - Time-based analysis\n📈 "Security stats" - Detection summary\n🚨 "Threat analysis" - Weapon detection review\n\nJust ask me naturally about your security concerns!`;
    }

    // Default response
    const responses = [
      "I'm here to help with security analysis. Try asking about recent threats, system status, or detection statistics.",
      "Ask me about your security alerts, system health, or recent detections for detailed analysis.",
      "I can analyze your security data. Try: 'Show me threats' or 'System status' for insights.",
      "Need security insights? Ask about recent alerts, threat analysis, or system performance."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 transform hover:scale-110 animate-pulse"
        >
          <MessageCircle size={24} className="text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] card shadow-premium flex flex-col z-50 animate-slide-in-up">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-glow">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Security Assistant</h3>
                <p className="text-xs text-slate-400">AI-Powered Analysis</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="flex items-start space-x-2 max-w-[85%]">
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-xl shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-600/80 to-blue-700/80 text-white'
                        : 'glass-dark border border-slate-600/30 text-white'
                    }`}
                  >
                    <p className="text-sm font-medium whitespace-pre-line">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle size={12} className="text-white" />
                  </div>
                  <div className="glass-dark border border-slate-600/30 px-4 py-3 rounded-xl">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/20 rounded-b-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about security alerts, threats, or system status..."
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
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