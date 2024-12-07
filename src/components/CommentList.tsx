'use client';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { TimeAgo } from '@/components/TimeAgo';
import { deleteComment, getComments } from '@/helpers/commentAPI';
import { GetComment, GetCommentsDTO, UserRole } from '@/types';

import { CommentForm } from './CommentForm';

interface CommentListProps {
  readonly articleId: number;
  readonly lang: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  articleId,
  lang,
}) => {
  const [editingComment, setEditingComment] = useState<GetComment | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [pageSize] = useState(5);
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', articleId],
    queryFn: ({ pageParam = 0 }) =>
      getComments(articleId, undefined, 'asc', undefined, pageParam, pageSize),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
  });

  const handleEdit = (comment: GetComment) => {
    setEditingComment(comment);
    setReplyToCommentId(null);
  };

  const handleReply = (commentId: number) => {
    setReplyToCommentId(commentId);
    setEditingComment(null);
  };

  const handleDelete = (commentId: number) => {
    deleteComment(commentId).then(() => refetch());
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setReplyToCommentId(null);
  };

  const renderComments = (data?: InfiniteData<GetCommentsDTO, unknown>) => {
    return data?.pages.map((page, pageIndex) => (
      <div key={pageIndex}>
        {page.content.map((comment) => (
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
                  lang={lang}
                />
              </Box>
              {editingComment && editingComment.id === comment.id ? (
                <CommentForm
                  articleId={articleId}
                  parentCommentId={comment.parentCommentId}
                  comment={comment}
                  onCommentAdded={async () => {
                    await refetch();
                    setEditingComment(null);
                  }}
                  onCancelEdit={handleCancelEdit}
                />
              ) : (
                <>
                  <Typography variant='body1'>{comment.content}</Typography>
                  {state.isAuthenticated &&
                    state.user?.role !== UserRole.ROLE_ADMIN && (
                      <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                        {state.user &&
                          state.user.username !== comment.user.username && (
                            <Button
                              variant='outlined'
                              size='small'
                              onClick={() => handleReply(comment.id)}
                            >
                              {t('replyBtn')}
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
                              {t('editBtn')}
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
                              {t('deleteBtn')}
                            </Button>
                          )}
                      </Box>
                    )}
                  {replyToCommentId === comment.id && (
                    <Box sx={{ marginTop: 2 }}>
                      <CommentForm
                        articleId={articleId}
                        parentCommentId={comment.id}
                        onCommentAdded={() => {
                          refetch();
                          setReplyToCommentId(null);
                        }}
                        onCancelEdit={handleCancelEdit}
                      />
                    </Box>
                  )}
                </>
              )}
              {comment.replies && comment.replies.content?.length > 0 && (
                <Box sx={{ marginTop: 2, marginLeft: 2 }}>
                  {renderComments(comment.replies)}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    ));
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      {renderComments(data)}
      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      {!editingComment && replyToCommentId === null && (
        <CommentForm articleId={articleId} onCommentAdded={() => refetch()} />
      )}
    </Box>
  );
};
