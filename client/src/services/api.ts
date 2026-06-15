import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authorization token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and force logout on auth errors
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
