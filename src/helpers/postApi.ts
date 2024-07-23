import {axiosInstance} from "@/helpers/axiosInstance";
import {Post} from "@/types";

export const createPost = async (requestData: {
    categoryIds: number[],
    title: string,
    content: string
}): Promise<Post> => {
    try {
        const response = await axiosInstance.post("/posts", requestData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating post: " + error.message);
        throw error;
    }
}


export const updatePost = (id: number, requestData: {
    title?: string,
    content?: string
    categoryIds: number[]
}) => {
    axiosInstance.put(`/posts/${id}`, requestData)
        .then(() => console.log("Post updated successfully"))
        .catch((error: any) => {
            console.error("Error updating post: " + error.message);
        });
}

export const getPosts = async (category?: number): Promise<Post[]> => {
    try {
        const response = await axiosInstance.get('/posts', {params: {category: category}});
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

export const getPostById = async (id: number): Promise<Post> => {
    try {
        const response = await axiosInstance.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

export const deletePost = (id: number) => {
    axiosInstance.delete(`/posts/${id}`)
        .then(() => console.log("Post deleted successfully"))
        .catch((error) => console.error(error))
}