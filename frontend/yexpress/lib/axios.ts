import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", 
  withCredentials: true, // 🔴 REQUIRED for cookies
});

export default api;
