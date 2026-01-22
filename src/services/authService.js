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
 * Handles login, autologin, and session management
 */
const authService = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} brandId - Brand ID (default: HEDG)
   * @param {string} systemId - System ID (default: web)
   * @returns {Promise} - Response with customer data and session info
   */
  login: async (email, password, brandId = 'HEDG', systemId = 'web') => {
    try {
      const response = await authAPI.post('/login', {
        email,
        password,
        brand_id: brandId,
        system_id: systemId,
      });

      // Store access token in localStorage if provided
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }

      // Store customer data
      if (response.data.customer) {
        localStorage.setItem('customer', JSON.stringify(response.data.customer));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Auto-login using existing auth_id cookie
   * @param {string} brandId - Brand ID (default: HEDG)
   * @param {string} systemId - System ID (default: web)
   * @returns {Promise} - Response with customer data and session info
   */
  autologin: async (brandId = 'HEDG', systemId = 'web') => {
    try {
      const response = await authAPI.post('/autologin', {
        brand_id: brandId,
        system_id: systemId,
      });

      // Store customer data
      if (response.data.customer) {
        localStorage.setItem('customer', JSON.stringify(response.data.customer));
      }

      return response.data;
    } catch (error) {
      console.error('Autologin error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logout - Clear local storage and cookies
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('customer');
    // Note: Cookies (sid, auth_id) are httpOnly and can't be cleared from frontend
    // They will be cleared by the backend or expire naturally
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid session
   */
  isAuthenticated: () => {
    // Check if we have customer data in localStorage
    const customer = localStorage.getItem('customer');
    return !!customer;
  },

  /**
   * Get current customer data
   * @returns {Object|null} - Customer object or null
   */
  getCustomer: () => {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
  },

  /**
   * Get access token
   * @returns {string|null} - Access token or null
   */
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  /**
   * Check authentication status on app load
   * Attempts autologin if auth_id cookie exists
   * @returns {Promise<boolean>} - True if authenticated
   */
  checkAuthStatus: async () => {
    // First check if we already have customer data
    if (authService.isAuthenticated()) {
      return true;
    }

    // Try autologin (will work if auth_id cookie exists)
    try {
      await authService.autologin();
      return true;
    } catch (error) {
      // Autologin failed - user needs to login manually
      return false;
    }
  },
};

export default authService;
