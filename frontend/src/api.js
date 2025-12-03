import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: backendUrl, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
