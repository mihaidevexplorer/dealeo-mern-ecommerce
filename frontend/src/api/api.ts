// src/api/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const local: string = 'http://localhost:5000';
// const production: string = '';

const api: AxiosInstance = axios.create({
    baseURL: `${local}/api`
});

export default api;