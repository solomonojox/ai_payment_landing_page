import axios from "axios";
import { ApiUrl } from "../config/apiConfig";

const api = axios.create({
  baseURL: ApiUrl,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add token dynamically before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fasma_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;