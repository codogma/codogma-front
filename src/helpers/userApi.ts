import {axiosInstance} from "@/helpers/axiosInstance";
import {User, UserRole} from "@/types";
import Cookies from "js-cookie";
import axios from "axios";

export type UserUpdate = {
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    newEmail?: string,
    currentPassword?: string,
    newPassword?: string,
    avatar?: File,
    shortInfo?: string
}

export const updateUser = async (requestData: UserUpdate): Promise<User> => {
    try {
        const response = await axiosInstance.put(`/users`, requestData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        const user: User = {
            ...response.data,
            avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.avatarUrl}?t=${new Date().getTime()}`
        };
        Cookies.set('user', JSON.stringify(user), {secure: true, sameSite: 'strict'});
        window.dispatchEvent(new Event("storage"));
        console.log("User updated successfully")
        return user;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data.map((user: User) => ({
            ...user,
            imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${user.avatarUrl}?t=${new Date().getTime()}`
        }))
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const getAuthors = async (categoryId?: number): Promise<User[]> => {
    try {
        const response = await axiosInstance.get(`/users`, {
            params: {
                categoryId,
                role: UserRole.ROLE_AUTHOR
            }
        });
        const users: User[] = response.data;
        return users.map((user: User) => ({
            ...user,
            avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${user.avatarUrl}?t=${new Date().getTime()}`
        }))
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
            avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.avatarUrl}?t=${new Date().getTime()}`,
            subscribers: response.data.subscribers.map((user: User) => ({
                ...user,
                avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${user.avatarUrl}?t=${new Date().getTime()}`
            }))
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


export const checkSubscription = async (username: string): Promise<boolean> => {
        try {
           const response = await axiosInstance.get(`/users/${username}/is-subscribed`);
           return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

export const unsubscribeToUser = async (username: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/users/${username}/unsubscribe`);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const subscribeToUser = async (username: string): Promise<void> => {
    try {
        await axiosInstance.post(`/users/${username}/subscribe`);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
