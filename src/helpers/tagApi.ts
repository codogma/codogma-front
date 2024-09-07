import {axiosInstance} from "@/helpers/axiosInstance";
import {Tag} from "@/types";

export type TagCreate = {
    name: string
}

export const getTagsByName = async (name: string): Promise<Tag[]> => {
    try {
        const response = await axiosInstance.get(`/tags?name=${name}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}