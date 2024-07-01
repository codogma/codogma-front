import {axiosInstance} from "@/helpers/axios";
import {Category} from "@/types";

export const createCategory = (requestData: { name: string }) => {
    axiosInstance.post("/categories", requestData)
        .then(() => console.log("Category created successfully"))
        .catch((error) => {
            console.error("Error creating categories: " + error.message);
        });
}

export const updateCategory = (id: number, requestData: { name?: string }) => {
    axiosInstance.put(`/categories/${id}`, requestData)
        .then(() => console.log("Category updated successfully"))
        .catch((error) => console.error(error))
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error)
        throw error;
    }
};

export const getCategoryById = async (id: number): Promise<Category> => {
    try {
        const response = await axiosInstance.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

export const deleteCategory = (id: number) => {
    axiosInstance.delete(`/categories/${id}`)
        .then(() => console.log("Category deleted successfully"))
        .catch((error) => console.error(error))
}