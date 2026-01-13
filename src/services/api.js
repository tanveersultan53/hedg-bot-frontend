import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/onboarding`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const onboardingAPI = {
  // Start onboarding
  startOnboarding: (telegramData) => {
    return api.post('/start/', telegramData);
  },

  // Spin wheel
  spinWheel: (sessionToken) => {
    return api.post('/spin/', { session_token: sessionToken });
  },

  // Submit registration form
  submitForm: (formData) => {
    return api.post('/submit/', formData);
  },

  // Update session status
  updateStatus: (sessionToken, status) => {
    return api.post('/update-status/', {
      session_token: sessionToken,
      status: status,
    });
  },

  // Get session status
  getSessionStatus: (sessionToken) => {
    return api.get(`/session/${sessionToken}/`);
  },

  // Auto login
  autoLogin: (telegramId) => {
    return api.post('/auto-login/', { telegram_id: telegramId });
  },
};

export default api;
