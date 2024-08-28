import {axiosInstance} from "@/helpers/axiosInstance";
import {Article} from "@/types";

export type CreateArticleDTO = {
    categoryIds: number[],
    title: string,
    content: string,
    tags?: string[]
}

export type UpdateArticleDTO = {
    title: string,
    content: string,
    categoryIds: number[],
    tags?: string[]
}

export const createArticle = async (requestData: CreateArticleDTO): Promise<Article> => {
    try {
        const response = await axiosInstance.post("/articles", requestData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating article: " + error.message);
        throw error;
    }
}


export const updateArticle = async (id: number, requestData: UpdateArticleDTO): Promise<Article> => {
    try {
        const response = await axiosInstance.put(`/articles/${id}`, requestData)
        return response.data;
    } catch (error: any) {
        console.error("Error updating article: " + error.message);
        throw error;
    }
}

export const getArticles = async (categoryId?: number, page: number = 0, size: number = 10, tag?: string, content?: string, authorId?: number): Promise<{
    totalElements: number,
    totalPages: number,
    content: Article[]
}> => {
    try {
        const response = await axiosInstance.get('/articles', {
            params: {
                tag,
                content,
                categoryId,
                page,
                size,
                authorId
            }
        });
        return {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            content: response.data.content.map((article: Article) => ({
                ...article,
                authorAvatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${article.authorAvatarUrl}`
            }))
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

export const getArticleById = async (id: number): Promise<Article> => {
    try {
        const response = await axiosInstance.get(`/articles/${id}`);
        const article: Article = response.data
        return {
            ...article,
            authorAvatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${article.authorAvatarUrl}`
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