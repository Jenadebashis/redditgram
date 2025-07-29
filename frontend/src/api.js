// src/api.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Handle token expiration + retry once
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === 'token_not_valid';

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');

        if (!refreshToken) throw new Error("Missing refresh token");

        const res = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;
        localStorage.setItem('access', newAccessToken);

        // 🔄 Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("🔁 Token refresh failed:", refreshError);
        // Optionally:
        localStorage.clear();
        window.location.href = "/login"; // 🔐 Force login again
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const likeComment = async (commentId) => {
  const res = await API.post(`/comments/${commentId}/like/`);
  return res.data;
};

export default API;
