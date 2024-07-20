import axios from "axios";

// Создание экземпляра axios
export const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api",
    timeout: 5000,
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

// // Обработка ответов
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         if (error.response && error.response.status === 401) {
//             try {
//                 // Попытка обновления токена
//                 await axiosInstance.post('/auth/refresh-token');
//                 // Повторение исходного запроса после успешного обновления токена
//                 return axiosInstance(error.config);
//             } catch (refreshError) {
//                 // Если не удалось обновить токен, перенаправляем на страницу входа
//                 if (typeof window !== "undefined") {
//                     window.location.href = "/login";
//                 }
//             }
//         }
//         // Пробрасываем ошибку дальше
//         return Promise.reject(error);
//     }
// );