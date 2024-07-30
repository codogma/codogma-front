import {axiosInstance} from "@/helpers/axiosInstance";
import {Article} from "@/types";

export const createArticle = async (requestData: {
    categoryIds: number[],
    title: string,
    content: string
}): Promise<Article> => {
    try {
        const response = await axiosInstance.post("/articles", requestData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating article: " + error.message);
        throw error;
    }
}


export const updateArticle = (id: number, requestData: {
    title?: string,
    content?: string
    categoryIds: number[]
}) => {
    axiosInstance.put(`/articles/${id}`, requestData)
        .then(() => console.log("Article updated successfully"))
        .catch((error: any) => {
            console.error("Error updating article: " + error.message);
        });
}

export const getArticles = async (category?: number): Promise<Article[]> => {
    try {
        const response = await axiosInstance.get('/articles', {params: {category: category}});
        return [
            ...response.data.map((article: Article) => ({
                ...article,
                authorAvatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${article.authorAvatarUrl}`
            }))
        ];
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
}

export const getArticleById = async (id: number): Promise<Article> => {
    try {
        const response = await axiosInstance.get(`/articles/${id}`);
        return {
            ...response.data,
            authorAvatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.authorAvatarUrl}`
        };
    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
};

export const deleteArticle = (id: number) => {
    axiosInstance.delete(`/articles/${id}`)
        .then(() => console.log("Article deleted successfully"))
        .catch((error) => console.error(error))
}