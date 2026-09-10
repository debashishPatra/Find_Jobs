import axios from 'axios';

// In production, set REACT_APP_API_URL (e.g. in Netlify's environment
// variables) to your deployed backend, e.g. https://your-app.onrender.com/api
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://find-jobs-2k5m.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
