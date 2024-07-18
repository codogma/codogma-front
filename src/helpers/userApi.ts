import {axiosInstance} from "@/helpers/axiosInstance";
import {User} from "@/types";

export const updateUser = (username: string, requestData: { username?: string }) => {
    axiosInstance.put(`/users/${username}`, requestData)
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


export const getUserByUsername = async (username: string): Promise<User> => {
    try {
        const response = await axiosInstance.get(`/users/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deleteUser = (username: string) => {
    axiosInstance.delete(`/users/${username}`)
        .then(() => console.log("User deleted successfully"))
        .catch((error) => console.error(error))
}