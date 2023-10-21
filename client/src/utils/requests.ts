// import axios from "axios";

import { logout } from "@api/auth";
import { useAuth } from "@context/auth-context";

// const instance = axios.create({
//   baseURL: "http://localhost:5000",
//   timeout: 1000,
//   headers: { "X-Custom-Header": "foobar" },
// });

// // 添加请求拦截器
// instance.interceptors.request.use(
//   function (config) {
//     // 在发送请求之前做些什么
//     console.log(config.baseURL);
//     if (config.url) {
//       config.url = config.baseURL + config.url;
//     }

//     return config;
//   },
//   function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );

// // 添加响应拦截器
// axios.interceptors.response.use(
//   function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     return response;
//   },
//   function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   }
// );

// export default instance;

// import qs from "qs";
interface Config extends RequestInit {
  token?: string;
  data?: object;
}
const apiUrl: string = "http://localhost:5000/api";
export const http = async (
  endpoint: string,
  { data, token, ...customConfig }: Config = {}
) => {
  const config = {
    methods: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };
  // if(config.methods.toUpperCase()==='GET'){
  //   endpoint+=`?${qs.stringify(data)}`;
  // }
  if (config.methods.toUpperCase() === "POST") {
    config.body = JSON.stringify(data || {});
  }
  return fetch(`${apiUrl}${endpoint}`, config).then(async (res) => {
    if (res.status === 401) {
      await logout();
      window.location.reload();
      return Promise.reject({ message: "请重新登录" });
    }
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      console.log(res.statusText);
      throw new Error(res.statusText);
    }
  });
};

export const useAuthHttp = () => {
  const { user } = useAuth();
  return ([endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token });
};

export const useHttp = () => {
  return (...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config });
};
