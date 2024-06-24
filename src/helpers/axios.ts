import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your-token',
    },
})