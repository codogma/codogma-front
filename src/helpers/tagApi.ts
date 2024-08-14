import {axiosInstance} from "@/helpers/axiosInstance";
import {Category, Tag} from "@/types";

export type TagCreate = {
    name: string
}

export const createTag = async (requestData: TagCreate): Promise<Tag> => {
    try {
        const response = await axiosInstance.post<Tag>("/tags", requestData);
        console.log("Tag created successfully");
        return response.data;
    } catch (error) {
        console.error("Error creating tag: " + error);
        throw error;
    }
};

export const getTagsByName = async (name: string): Promise<Tag[]> => {
    try {
        const response = await axiosInstance.get(`/tags?name=${name}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}