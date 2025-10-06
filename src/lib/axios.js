import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://canopus-backend.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
// s
export default AxiosInstance;
