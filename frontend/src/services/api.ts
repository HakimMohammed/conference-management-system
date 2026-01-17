import axios from 'axios';
import keycloak from '../auth/keycloak';

const api = axios.create({
    baseURL: 'http://localhost:8888',
});

api.interceptors.request.use(
    (config) => {
        if (keycloak.authenticated) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
