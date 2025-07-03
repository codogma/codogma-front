'use client';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { TimeAgo } from '@/components/TimeAgo';
import { deleteComment, getComments } from '@/helpers/commentAPI';
import { useEventListener } from '@/helpers/useEventListener';
import { GetComment, Language, UserRole } from '@/types';

import { CommentForm } from './CommentForm';

interface CommentListProps {
  readonly articleId: number;
  readonly lang: Language;
}

export const CommentList: React.FC<CommentListProps> = ({
  articleId,
  lang,
}) => {
  const [editingComment, setEditingComment] = useState<GetComment | null>(null);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number>(5);
  const scrollTarget = useRef<string | null>(null);
  const { state } = useAuth();
  const t = useTranslations();

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    {
      queryKey: ['comments', articleId, pageSize],
      queryFn: ({ pageParam = 0 }) =>
        getComments(
          articleId,
          undefined,
          'asc',
          undefined,
          pageParam,
          pageSize,
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        const nextPage = pages.length;
        return nextPage < lastPage.totalPages ? nextPage : undefined;
      },
      enabled: !!articleId,
    },
  );

  const removeActive = useCallback(async () => {
    document.querySelectorAll('.comment-card-link').forEach((el) => {
      el.classList.remove('active');
    });
  }, []);

  const checkCommentExistenceOnLoad = useCallback(async () => {
    if (window.location.hash.includes('#comment-')) {
      await removeActive();
      const targetCommentId = window.location.hash.replace('#comment-', '');
      if (!targetCommentId) return;
      scrollTarget.current = targetCommentId;

      let commentElement = document.getElementById(
        `comment-${targetCommentId}`,
      );

      if (!commentElement) {
        const page = data?.pages[data.pages.length - 1];
        if (page?.totalElements) {
          setPageSize(page.totalElements);
        }
        await fetchNextPage();
        commentElement = document.getElementById(`comment-${targetCommentId}`);
      }

      if (commentElement) {
        requestAnimationFrame(() => {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          commentElement.classList.add('active');
        });
      }
    }
  }, [data, fetchNextPage, removeActive]);

  useEventListener('searchOrHashChange', async () => {
    await checkCommentExistenceOnLoad();
  });

  useEventListener('remove-active', async () => {
    scrollTarget.current = null;
    await removeActive();
  });

  useEffect(() => {
    checkCommentExistenceOnLoad();
  }, [checkCommentExistenceOnLoad]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (scrollTarget.current) {
        const element = document.getElementById(
          `comment-${scrollTarget.current}`,
        );
        element?.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

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

  const hasMoreComments =
    !!data?.pages && data.pages.length < (data.pages[0]?.totalPages || 0);

  const renderComments = (comments?: GetComment[]) => {
    return comments?.map((comment) => (
      <Card
        key={`comment-${comment.id}`}
        id={`comment-${comment.id}`}
        variant='outlined'
        className='card comment-card-link'
      >
        <CardContent className='card-content'>
          <Box className='card-header'>
            <AvatarImage
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
          {comment.replies && comment.replies?.length > 0 && (
            <Box sx={{ marginTop: 2, marginLeft: 2 }}>
              {renderComments(comment.replies)}
            </Box>
          )}
        </CardContent>
      </Card>
    ));
  };

  return articleId ? (
    <>
      <Typography id='comments' component='div'>
        {t('comments')}:
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex}>{renderComments(page.content)}</div>
        ))}
        <LoadingButton
          onClick={() => fetchNextPage()}
          loadingPosition='start'
          loading={isFetchingNextPage}
          variant='outlined'
          size='small'
          disabled={!hasMoreComments}
        >
          Load More
        </LoadingButton>
        {!editingComment && replyToCommentId === null && (
          <CommentForm articleId={articleId} onCommentAdded={() => refetch()} />
        )}
      </Box>
    </>
  ) : null;
};
