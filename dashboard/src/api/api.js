import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export default api;


