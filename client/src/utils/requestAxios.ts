import axios from "axios";
const apiUrl: string = "http://localhost:5000/api";

const service = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});

service.interceptors.request.use((config) => {
  console.log(config);
  return config;
});

service.interceptors.response.use((response) => {
  return response;
});

export default service;
