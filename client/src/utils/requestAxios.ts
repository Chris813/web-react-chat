import axios from "axios";
const apiUrl: string = process.env.REACT_APP_BACKEND_URL as string;
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
