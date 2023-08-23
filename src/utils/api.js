// src/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in requests
});

const api = {
    request: async (method, url, data = {}) => {
        try {
            const response = await axiosInstance({
                method,
                url,
                data,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default api;
