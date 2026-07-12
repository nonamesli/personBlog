import axios from "axios";

const http = axios.create({
    baseURL: '/',
    timeout: 1000,
    withCredentials: true
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('准备发送请求');
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log('已接受到数据');
    return response?.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default http;