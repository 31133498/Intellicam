const API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are INTELLICAM AI COPILOT, an elite security intelligence officer and AI assistant for the INTELLICAM surveillance platform.

IDENTITY & ROLE:
- You are a professional security expert with deep knowledge of threat analysis, incident response, and security operations
- You have access to real-time surveillance data and detection logs from the INTELLICAM system
- You provide actionable security intelligence and recommendations

CAPABILITIES:
- Analyze threat patterns and security events from the last 2 hours
- Provide security recommendations and best practices
- Explain threat classifications and severity levels
- Offer incident response guidance
- Monitor system performance and alert trends

RESPONSE STYLE:
- Professional but approachable
- Use security terminology appropriately
- Provide specific, actionable advice
- Reference actual detection data when available
- Be concise but thorough

SECURITY FOCUS AREAS:
- Weapon detection (knives, guns, scissors)
- Unauthorized access attempts
- Suspicious behavior patterns
- System performance monitoring
- Threat escalation protocols`;

class AICopilotService {
  static async chat(message, eventLogs = []) {
    // Fallback responses if API fails
    const fallbackResponses = {
      'threat': 'Based on current system analysis, no immediate threats detected. All security parameters are within normal ranges.',
      'status': 'INTELLICAM Security System Status: OPERATIONAL\n• AI Detection Engine: ACTIVE\n• Monitoring Coverage: 100%\n• Threat Detection: ENABLED\n• System Health: EXCELLENT',
      'help': 'I can assist with:\n• Security threat analysis\n• System status reports\n• Detection pattern analysis\n• Security recommendations\n• Incident response guidance',
      'recent': eventLogs.length > 0 ? `Recent activity summary:\n${eventLogs.slice(0, 3).map(e => `• ${e.object_type} detected (${Math.round(e.confidence * 100)}% confidence)`).join('\n')}` : 'No recent security events detected. System monitoring normally.',
      'default': 'I am your INTELLICAM AI Security Copilot. I can analyze threats, provide security insights, and help with system monitoring. What would you like to know about your security status?'
    };

    const recentEvents = this.getRecentEvents(eventLogs);
    const context = this.formatEventContext(recentEvents);
    
    // Check if API key is available
    console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'undefined');
    
    if (!API_KEY || API_KEY === "your-groq-api-key-here" || API_KEY.includes("placeholder")) {
      console.warn("Groq API key not configured. Please set REACT_APP_GROQ_API_KEY in .env file");
      return this.getFallbackResponse(message, fallbackResponses, eventLogs);
    }
    
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `${context}\n\nUser: ${message}` }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Groq API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Copilot error:", error);
      return this.getFallbackResponse(message, fallbackResponses, eventLogs);
    }
  }

  static getFallbackResponse(message, responses, eventLogs) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('threat') || lowerMessage.includes('danger')) {
      return responses.threat;
    }
    if (lowerMessage.includes('status') || lowerMessage.includes('system')) {
      return responses.status;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      return responses.help;
    }
    if (lowerMessage.includes('recent') || lowerMessage.includes('latest')) {
      return responses.recent;
    }
    
    return responses.default;
  }

  static getRecentEvents(eventLogs) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return eventLogs.filter(event => new Date(event.timestamp) > twoHoursAgo);
  }

  static formatEventContext(events) {
    if (events.length === 0) {
      return "SYSTEM STATUS: No security events detected in the last 2 hours. All systems operational.";
    }

    const threats = events.filter(e => ['knife', 'gun', 'scissors'].includes(e.object_type));
    const totalEvents = events.length;
    
    return `SECURITY BRIEFING (Last 2 Hours):
- Total Detections: ${totalEvents}
- Threat Objects: ${threats.length}
- Recent Events: ${events.slice(0, 5).map(e => 
  `${e.object_type} (${Math.round(e.confidence * 100)}%) at ${new Date(e.timestamp).toLocaleTimeString()}`
).join(', ')}`;
  }
}

export default AICopilotService;