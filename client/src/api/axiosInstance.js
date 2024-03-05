import axios from "axios";
import { getAuthToken } from "../utils/utility";

export const host = "https://snap-wave-server.onrender.com";
// export const host = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: host,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
