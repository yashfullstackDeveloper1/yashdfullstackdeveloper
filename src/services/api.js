import axios from 'axios';

const API = axios.create({
    baseURL: 'https://scos-backend-qx5a.onrender.com',
});
// Automatically add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('pre_context_token') || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;