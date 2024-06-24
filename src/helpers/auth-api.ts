import {axiosInstance} from "@/src/helpers/axios";

export const register = (requestData: { username: string, email: string, password: string }) => {
    axiosInstance.post("/auth/signup", requestData)
        .then(() => console.log("User registered successfully"))
        .catch((error: any) => {
            console.error("Error registering user: " + error.message);
        });
}

export const login = (requestData: { username: string, password: string }) => {
    axiosInstance.post("/auth/signin", requestData)
        .then(() => console.log("User logged in successfully"))
        .catch((error: any) => {
            console.error("Error logging in user: " + error.message);
        });
}