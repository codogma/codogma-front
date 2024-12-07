import { axiosInstance } from '@/helpers/axiosInstance';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
import { CreateComment, GetComment, UpdateComment } from '@/types';

export type GetCommentsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetComment[];
};

export const getComments = async (
  articleId?: number,
  username?: string,
  order: string = 'desc',
  content?: string,
  page: number = 0,
  size: number = 10,
): Promise<GetCommentsDTO> => {
  const response = await axiosInstance.get(`/comments`, {
    params: {
      articleId,
      username,
      order,
      content,
      page,
      size,
    },
  });
  return response.data;
};

export const createComment = async (
  createComment: CreateComment,
): Promise<GetComment> => {
  const response = await axiosInstance.post('/comments', createComment);
  dispatchCustomEvent('api', {
    message: 'Comment created',
    severity: 'success',
  });
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
  dispatchCustomEvent('api', {
    message: 'Comment updated',
    severity: 'success',
  });
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
  devConsoleInfo('Comment deleted successfully');
};
