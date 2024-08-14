import {axiosInstance} from "@/helpers/axiosInstance";
import {Category} from "@/types";

export type CategoryCreate = {
    name: string,
    image?: File,
    description?: string
}

export const createCategory = (requestData: CategoryCreate) => {
    axiosInstance.post("/categories", requestData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
        .then(() => console.log("Category created successfully"))
        .catch((error) => {
            console.error("Error creating categories: " + error.message);
        });
}

export const updateCategory = (id: number, requestData: { name?: string }): Promise<string> => {
    return axiosInstance.put(`/categories/${id}`, requestData)
        .then((response) => response.data)
        .catch((error: Error) => {
            console.error(error)
            throw error.message
        })
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data.map((category: Category) => ({
            ...category,
            imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${category.imageUrl}`
        }))
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