const API_KEY = process.env.REACT_APP_GROQ_API_KEY || "your-groq-api-key-here";
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
    const recentEvents = this.getRecentEvents(eventLogs);
    const context = this.formatEventContext(recentEvents);
    
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

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Copilot error:", error);
      return "I'm experiencing technical difficulties. Please try again.";
    }
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