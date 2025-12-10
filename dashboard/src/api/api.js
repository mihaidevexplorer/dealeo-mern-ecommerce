// src/api/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

//const local = 'http://localhost:5000';
const production = 'https://dealeo-backend.onrender.com';

const api: AxiosInstance = axios.create({
    baseURL: `${production}/api`
});

export default api;
