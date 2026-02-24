import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour les erreurs globales
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rc_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
