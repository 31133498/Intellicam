// AI Engine service for direct detection
const AI_ENGINE_URL = 'http://localhost:5001';

class AIService {
  async detectFrame(imageData, sessionId = 'demo_session') {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData
        })
      });

      if (!response.ok) {
        throw new Error(`AI detection failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI detection error:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('AI health check failed:', error);
      throw error;
    }
  }
}

export default new AIService();