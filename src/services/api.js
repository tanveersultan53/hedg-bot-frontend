import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending/receiving cookies
});

export const onboardingAPI = {
  // SIMPLIFIED API - Just 2 endpoints!

  // Check if user exists
  checkUser: (telegramId) => {
    return api.post('/check-user', { telegram_id: telegramId });
  },

  // Complete signup with all data
  signup: (userData) => {
    return api.post('/signup', userData);
  },
};


export default api;
