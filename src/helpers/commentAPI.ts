import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { CreateComment, GetComment, UpdateComment } from '@/types';

export const getCommentsByArticleId = async (
  articleId: number,
): Promise<GetComment[]> => {
  const response = await axiosInstance.get(`comments/article/${articleId}`);
  return response.data;
};

export const getCommentsByUsername = async (
  username: string,
): Promise<GetComment[]> => {
  const response = await axiosInstance.get(`/comments/user/${username}`);
  return response.data;
};

export const createComment = async (
  createComment: CreateComment,
): Promise<GetComment> => {
  const response = await axiosInstance.post('/comments', createComment);
  return response.data;
};

export const updateComment = async (
  commentId: number,
  updateComment: UpdateComment,
): Promise<GetComment> => {
  const response = await axiosInstance.put(
    `/comments/${commentId}`,
    updateComment,
  );
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
  devConsoleInfo('Comment deleted successfully');
};
