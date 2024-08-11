import {axiosInstance} from "@/helpers/axiosInstance";
import {User} from "@/types";
import Cookies from "js-cookie";

export type UserUpdate = {
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    newEmail?: string,
    currentPassword?: string,
    newPassword?: string,
    avatar?: File
}

export const updateUser = (requestData: UserUpdate) => {
    axiosInstance.put(`/users`, requestData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
        .then(() => console.log("User updated successfully"))
        .catch((error) => console.error(error))
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axiosInstance.get('/users');
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const getAuthors = async (): Promise<User[]> => {
    try {
        const response = await axiosInstance.get('/users/authors');
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const getUserByUsername = async (username: string): Promise<User> => {
    try {
        const response = await axiosInstance.get(`/users/${username}`);
        return {
            ...response.data,
            avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.avatarUrl}`
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deleteUser = (username: string) => {
    axiosInstance.delete(`/users/${username}`)
        .then(() => {
            Cookies.remove('user');
            window.dispatchEvent(new Event("storage"));
            console.log("User deleted successfully")
        })
        .catch((error) => console.error(error))
}