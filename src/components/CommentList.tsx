'use client';
import React, { useEffect, useState } from 'react';
import { CommentForm } from './CommentForm';
import { deleteComment, getCommentsByArticleId } from '@/helpers/commentAPI';
import { GetComment, UserRole } from '@/types';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';
import { TimeAgo } from '@/components/TimeAgo';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';

interface CommentListProps {
  articleId: number;
  comments?: GetComment[];
}

export const CommentList: React.FC<CommentListProps> = ({
  articleId,
  comments: initialComments,
}) => {
  const [comments, setComments] = useState<GetComment[]>(initialComments || []);
  const [editingComment, setEditingComment] = useState<GetComment | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const { state } = useAuth();

  useEffect(() => {
    if (!initialComments) {
      getCommentsByArticleId(articleId).then((data) => setComments(data));
    }
  }, [articleId, initialComments]);

  const handleEdit = (comment: GetComment) => {
    setEditingComment(comment);
    setReplyToCommentId(null);
  };

  const handleReply = (commentId: number) => {
    setReplyToCommentId(commentId);
    setEditingComment(null);
  };

  const handleDelete = async (commentId: number) => {
    await deleteComment(commentId);
    getCommentsByArticleId(articleId).then((data) => setComments(data));
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setReplyToCommentId(null);
  };

  const renderComments = (comments: GetComment[]) => {
    return comments.map((comment) => (
      <Card key={comment.id} variant='outlined' className='card'>
        <CardContent className='card-content'>
          <Box className='meta-container'>
            <AvatarImage
              className='article-user-avatar'
              src={comment.user.avatarUrl}
              alt={comment.user.username}
              variant='rounded'
              size={32}
            />
            <Link
              className='article-user-name'
              href={`/users/${comment.user.username}`}
            >
              {comment.user.username}
            </Link>
            <TimeAgo
              datetime={comment.createdAt}
              className='article-datetime'
            />
          </Box>
          {editingComment && editingComment.id === comment.id ? (
            <CommentForm
              articleId={articleId}
              parentCommentId={comment.parentCommentId}
              comment={comment}
              onCommentAdded={async () => {
                getCommentsByArticleId(articleId).then((data) =>
                  setComments(data),
                );
                setEditingComment(null);
              }}
              onCancelEdit={handleCancelEdit}
            />
          ) : (
            <>
              <Typography variant='body1'>{comment.content}</Typography>
              {state.isAuthenticated &&
                state.user?.role === UserRole.ROLE_ADMIN && (
                  <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                    {state.user &&
                      state.user.username !== comment.user.username && (
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={() => handleReply(comment.id)}
                        >
                          Reply
                        </Button>
                      )}
                    {state.user &&
                      state.user.username === comment.user.username && (
                        <Button
                          color='secondary'
                          variant='outlined'
                          size='small'
                          onClick={() => handleEdit(comment)}
                        >
                          Edit
                        </Button>
                      )}
                    {state.user &&
                      state.user.username === comment.user.username && (
                        <Button
                          color='error'
                          variant='outlined'
                          size='small'
                          onClick={() => handleDelete(comment.id)}
                        >
                          Delete
                        </Button>
                      )}
                  </Box>
                )}
              {replyToCommentId === comment.id && (
                <Box sx={{ marginTop: 2 }}>
                  <CommentForm
                    articleId={articleId}
                    parentCommentId={comment.id}
                    onCommentAdded={async () => {
                      getCommentsByArticleId(articleId).then((data) =>
                        setComments(data),
                      );
                      setReplyToCommentId(null);
                    }}
                    onCancelEdit={handleCancelEdit}
                  />
                </Box>
              )}
            </>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <Box sx={{ marginTop: 2, marginLeft: 2 }}>
              {renderComments(comment.replies)}
            </Box>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      {renderComments(comments)}
      {!editingComment && replyToCommentId === null && (
        <CommentForm
          articleId={articleId}
          onCommentAdded={() =>
            getCommentsByArticleId(articleId).then((data) => setComments(data))
          }
        />
      )}
    </Box>
  );
};
