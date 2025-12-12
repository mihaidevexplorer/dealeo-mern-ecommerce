// src/api/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) throw new Error("VITE_API_URL is missing");

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default api;



