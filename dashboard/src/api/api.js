// src/api/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_DASHBOARD_API_URL}/api`,
  
});

export default api;

