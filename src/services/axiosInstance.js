import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response, // return successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('authToken');

      // Redirect to /signin
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;