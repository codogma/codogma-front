import {axiosInstance} from "@/helpers/axiosInstance";
import {User} from "@/types";
import Cookies from 'js-cookie';

export const register = (requestData: { username: string, email: string, password: string }) => {
    axiosInstance.post("/auth/signup", requestData)
        .then((response) => console.log(response.data))
        .catch((error: any) => {
            console.error("Error registering user: " + error.message);
        });
}

export const login = async (requestData: { usernameOrEmail: string, password: string }): Promise<User> => {
    try {
        await axiosInstance.post("/auth/login", requestData);
        window.dispatchEvent(new Event("storage"));
        const user = await currentUser();
        Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
        return user;
    } catch (error: any) {
        console.error("Error logging in user: " + error.message);
        throw new Error("Error logging in user");
    }
}

export const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
        console.log("User logged out successfully");
        Cookies.remove('user');
        window.dispatchEvent(new Event("storage"));
    } catch (error: any) {
        console.error("Error logging out user: " + error.message);
    }
};

export const currentUser = async (): Promise<User> => {
    try {
        const response = await axiosInstance.get("/auth/current-user");
        return response.data;
    } catch {
        throw new Error('Error fetching current user');
    }
};