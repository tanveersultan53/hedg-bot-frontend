import axios from 'axios';

const API_URL =  "https://api.hedg.com"

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'HTTP_HEADER_NAME':'x-channel-token',
    'HTTP_HEADER_VALUE':'019ae3b9-ea5f-75cf-a262-264b772dcb2d'

  },
  withCredentials: true, // Enable sending/receiving cookies
});

export const webTradingAPI = {

  // Complete signup with all data
  signup: (userData) => {
    return api.post('/customers', userData);
  },
};


export default api;
