import {axiosInstance} from "@/helpers/axios";
import {User} from "@/types";

export const updateUser = (id: number, requestData: { username?: string }) => {
    axiosInstance.put(`/users/${id}`, requestData)
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


export const getUserById = async (id: number): Promise<User> => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deleteUser = (id: number) => {
    axiosInstance.delete(`/users/${id}`)
        .then(() => console.log("User deleted successfully"))
        .catch((error) => console.error(error))
}