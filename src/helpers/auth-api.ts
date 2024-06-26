import {axiosInstance} from "@/helpers/axios";

export const register = (requestData: { username: string, email: string, password: string }) => {
    axiosInstance.post("/auth/signup", requestData)
        .then(() => console.log("User registered successfully"))
        .catch((error: any) => {
            console.error("Error registering user: " + error.message);
        });
}

export const login = (requestData: { usernameOrEmail: string, password: string }) => {
    axiosInstance.post("/auth/login", requestData)
        .then((response) => {
            console.log("User logged in successfully")
            const token = response.data.token
            localStorage.setItem("token", token)
        })
        .catch((error: any) => {
            console.error("Error logging in user: " + error.message);
        });
}

export const logout = () => {
    localStorage.removeItem("token")
}