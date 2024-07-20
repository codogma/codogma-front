import {axiosInstance} from "@/helpers/axiosInstance";

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
            window.dispatchEvent(new Event("storage"));
        })
        .catch((error: any) => {
            console.error("Error logging in user: " + error.message);
        });
}

export const logout = () => {
    //TODO реализовать этот метод на бэкенде
    axiosInstance.post("/auth/logout")
        .then((response) => console.log(response.data))
        .catch((error: any) => {
            console.error("Error logging out user: " + error.message);
        });
    window.dispatchEvent(new Event("storage"));
}

export const checkAuth = async (): Promise<boolean> => {
    try {
        await axiosInstance.get("/auth/auth-check");
        return true;
    } catch {
        return false;
    }
};