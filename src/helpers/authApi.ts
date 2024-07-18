import {axiosInstance} from "@/helpers/axiosInstance";
import Cookies from "js-cookie";

export const register = (requestData: { username: string, email: string, password: string }) => {
    axiosInstance.post("/auth/signup", requestData)
        .then((response) => console.log(response.data))
        .catch((error: any) => {
            console.error("Error registering user: " + error.message);
        });
}

export const login = (requestData: { usernameOrEmail: string, password: string }) => {
    axiosInstance.post("/auth/login", requestData)
        .then((response) => {
            console.log("User logged in successfully")
            const token = response.data.token
            Cookies.set("auth-token", token, {expires: 1})
        })
        .catch((error: any) => {
            console.error("Error logging in user: " + error.message);
        });
}

export const logout = () => {
    Cookies.remove("auth-token")
}