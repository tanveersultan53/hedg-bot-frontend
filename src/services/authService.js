import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create a separate axios instance for auth endpoints
const authAPI = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: This allows cookies to be sent/received
});

/**
 * Authentication Service
 * Handles user authentication and session management
 */
const authService = {
  /**
   * Check if user exists by telegram_id
   * @param {string} telegramId - Telegram user ID
   * @returns {Promise} - Response with user status and data
   */
  checkUser: async (telegramId) => {
    try {
      const response = await authAPI.post('/check-user', {
        telegram_id: telegramId,
      });

      // If existing user, store access token and redirect URL
      if (response.data.status === 'existing_user' && response.data.user) {
        if (response.data.user.access_token) {
          localStorage.setItem('access_token', response.data.user.access_token);
        }
        if (response.data.user.redirect_url) {
          localStorage.setItem('redirect_url', response.data.user.redirect_url);
        }
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Check user error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout - Clear local storage
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('redirect_url');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid session
   */
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  /**
   * Get current user data
   * @returns {Object|null} - User object or null
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get access token
   * @returns {string|null} - Access token or null
   */
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  /**
   * Get redirect URL
   * @returns {string|null} - Redirect URL or null
   */
  getRedirectUrl: () => {
    return localStorage.getItem('redirect_url');
  },
};

export default authService;
