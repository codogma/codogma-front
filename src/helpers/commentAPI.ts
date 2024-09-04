import {axiosInstance} from "@/helpers/axiosInstance";
import {CreateComment, GetComment, UpdateComment} from "@/types";

export const getCommentsByArticleId = async (articleId: number): Promise<GetComment[]> => {
    try {
        const response = await axiosInstance.get(`comments/article/${articleId}`);
        const comments: GetComment[] = response.data;

        const updateAvatarUrls = (comments: GetComment[]): GetComment[] => {
            return comments.map((comment) => ({
                ...comment,
                user: {
                    ...comment.user,
                    avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${comment.user.avatarUrl}`
                },
                replies: comment.replies ? updateAvatarUrls(comment.replies) : []
            }));
        };

        return updateAvatarUrls(comments);
    } catch (error) {
        console.error("Error fetching comments by article ID:", error);
        throw error;
    }
};

export const getCommentsByUsername = async (username: string): Promise<GetComment[]> => {
    try {
        const response = await axiosInstance.get(`/comments/user/${username}`);
        const comments: GetComment[] = response.data;
        const updateAvatarUrls = (comments: GetComment[]): GetComment[] => {
            return comments.map((comment) => ({
                ...comment,
                user: {
                    ...comment.user,
                    avatarUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${comment.user.avatarUrl}`
                },
                replies: comment.replies ? updateAvatarUrls(comment.replies) : []
            }));
        };

        return updateAvatarUrls(comments);
    } catch (error) {
        console.error("Error fetching comments by username:", error);
        throw error;
    }
};

export const createComment = async (createComment: CreateComment): Promise<GetComment> => {
    try {
        const response = await axiosInstance.post("/comments", createComment);
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

export const updateComment = async (commentId: number, updateComment: UpdateComment): Promise<GetComment> => {
    try {
        const response = await axiosInstance.put(`/comments/${commentId}`, updateComment);
        return response.data;
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
};

export const deleteComment = async (commentId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/comments/${commentId}`);
        console.log("Comment deleted successfully");
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};