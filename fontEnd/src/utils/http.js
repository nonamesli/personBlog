import axios from "axios";

const http = axios.create({
    baseURL: '/',
    timeout: 10000,
    withCredentials: true
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 登录过期统一处理
    const data = response?.data;
    if (data?.meta?.code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    }
    return data;
}, function (error) {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default http;