// src/api/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://eventmate-production-b589.up.railway.app', 
});


apiClient.interceptors.request.use(
    (config) => {
 
        const token = localStorage.getItem('token'); 

        if (token) {
       
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => {
        
        return Promise.reject(error);
    }
);

export default apiClient; 