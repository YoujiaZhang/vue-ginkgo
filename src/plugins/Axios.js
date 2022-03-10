import axios from "axios";
import router from "../router/index.js";

const service = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "http://211.69.197.48:8080/api",
  timeout: 10000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = {};
    if (error.message.includes("timeout")) {
      message = { 
        code: 404,
        msg: '你所访问的页面走丢了'
      }
    } else if (error.response.status == 500) {
      message = { 
        code: 500,
        msg: '服务器遇到错误，无法完成请求'
      };
    } else if (error.response.status == 403) {
      message = { 
        code: 403,
        msg: '服务器遇到错误，无法完成请求'
      };
    } else if (error.response.status == 400) {
      message = { 
        code: 400,
        msg: '请求错误，服务器拒绝了你的请求'
      };
    } else{
      message = { 
        code: 404,
        msg: '你所访问的页面走丢了'
      }
    }
    router.push({
      name: "error",
      params: message,
    });
    return Promise.reject(error);
  }
);

export default service;
