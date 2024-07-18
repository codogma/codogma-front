import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("/auth/auth-check")
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await axiosInstance.post('/auth/refresh-token');
                return axiosInstance(error.config);
            } catch (refreshError) {
                if (typeof window !== "undefined") {
                    Cookies.remove("token");
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);