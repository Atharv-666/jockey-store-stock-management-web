import axios from 'axios';

// Sanitize production VITE_API_URL to prevent bracket or formatting syntax errors
let rawApiUrl = import.meta.env.VITE_API_URL || '/api';

if (typeof rawApiUrl === 'string') {
  // Strip out stray square brackets [, ], or quotes from env input
  rawApiUrl = rawApiUrl.replace(/[\[\]'"]/g, '').trim();
  // Strip trailing slashes
  if (rawApiUrl.endsWith('/')) {
    rawApiUrl = rawApiUrl.slice(0, -1);
  }
}

const axiosClient = axios.create({
  baseURL: rawApiUrl || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
axiosClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized/Expired token globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
