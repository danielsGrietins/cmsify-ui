import axios from 'axios';
import NProgress from "nprogress";
let axiosInstance = axios.create({
    baseURL: '/api/admin',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
});

axiosInstance.interceptors.request.use(config => {
    NProgress.start();

    return config
});

// before a response is returned stop nprogress
axiosInstance.interceptors.response.use(response => {
    NProgress.done();

    return response
}, (error) => {
    NProgress.done();

    return Promise.reject(error);
});

export default axiosInstance;
