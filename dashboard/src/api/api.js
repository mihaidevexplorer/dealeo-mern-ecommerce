// src/api/api.ts
import axios from "axios";

//const local = "http://localhost:5000";


const production = "https://dealeo-backend.onrender.com";

const api_url = import.meta.env.PROD ? production : local;

const api = axios.create({
  baseURL: `${api_url}/api`,
  withCredentials: true,         
});

export default api;



