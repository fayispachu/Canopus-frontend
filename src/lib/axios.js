import axios from "axios";
const AxiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to all requests
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosInstance;

// https://canopus-backend.onrender.com d
