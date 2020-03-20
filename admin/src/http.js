import axios from 'axios';

import Vue from 'vue';

import router from './router/index';

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
});

// 拦截请求体添加token参数
http.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// 拦截返回体
http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    // console.log(err.response.data.message);
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message
      });
    }
    if (err.response.status === 401) {
      // 这样不行，访问不到
      // Vue.$router.push('/login');
      router.push('/login');
    }
  }
);

export default http;
