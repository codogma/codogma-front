import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Включение поддержки куки
});

// Обработка запросов
axiosInstance.interceptors.request.use(
    (config) => {
        // Добавление логики перед запросом, если необходимо
        return config;
    },
    (error) => {
        // Обработка ошибок запроса
        return Promise.reject(error);
    }
);

// Обработка ответов
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Обработка ошибок ответа
        return Promise.reject(error);
    }
);