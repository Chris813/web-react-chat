import axios from "axios";

let apiUrl;
if (import.meta.env.VITE_ENV === "development") {
  // 开发环境逻辑
  apiUrl = import.meta.env.VITE_DEV_BACKEND_URL + "/api";
} else {
  // 生产环境逻辑
  apiUrl = import.meta.env.REACT_APP_PROD_BACKEND_URL + "/api";
}
const service = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

service.interceptors.request.use((config) => {
  return config;
});

service.interceptors.response.use((response) => {
  return response;
});

export default service;
