import axios from 'axios';

// Main backend for authentication and alerts
const API_BASE_URL = 'https://intellicam.onrender.com/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.client.post('/users/login', credentials);
    return response.data;
  }

  async signup(userData) {
    const response = await this.client.post('/users/signup', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/users/');
    return response.data;
  }

  // --- THIS IS THE CORRECTED FUNCTION ---
  // It now accepts 'code' and 'email' as required by your backend
  async verifyEmail(code, email) {
    const response = await this.client.post('/users/verify-email', { email, code });
    return response.data;
  }
  // --- END CORRECTION ---

  async resendVerificationCode(email) {
    const response = await this.client.post('/users/resend-code', { email });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await this.client.post('/users/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, newPassword) {
    const response = await this.client.post('/users/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  }

  // Monitoring endpoints
  async startMonitoring(data) {
    const response = await this.client.post('/monitoring/start', data);
    return response.data;
  }

  async stopMonitoring(data) {
    const response = await this.client.post('/monitoring/stop', data);
    return response.data;
  }

  // Alerts endpoints
  async getAlerts() {
    const response = await this.client.get('/alerts/');
    return response.data;
  }

  // WebSocket URL for alerts
  getWebSocketUrl(userId) {
    return `wss://intellicam.onrender.com/api/ws/alerts/${userId}`;
  }

  // Utility methods
  setAuthToken(token) {
    localStorage.setItem('token', token);
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete this.client.defaults.headers.common['Authorization'];
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    this.removeAuthToken();
  }
}

const apiService = new ApiService();
export default apiService;