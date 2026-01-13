import axios from 'axios';

// Fixed absolute URL for Electron (file:// protocol doesn't support relative paths)
export const API_BASE_URL = "http://127.0.0.1:5000";

// Create axios instance with proper configuration
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Backend routes are under /api prefix
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Detailed error logging as required
    console.error('❌ API Response Error:', {
      message: error.message,
      responseData: error.response?.data,
      url: error.config?.url,
      code: error.code,
      status: error.response?.status
    });
    
    // If token expired (401), clear it
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    
    return Promise.reject(error);
  }
);

export default api;
