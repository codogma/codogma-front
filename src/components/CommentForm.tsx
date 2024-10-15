import { Box, Button, Link, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { createComment, updateComment } from '@/helpers/commentAPI';
import { CreateComment, GetComment, UpdateComment, UserRole } from '@/types';

interface CommentFormProps {
  readonly articleId: number;
  readonly parentCommentId?: number;
  readonly comment?: GetComment | null;
  readonly onCommentAdded: () => void;
  readonly onCancelEdit?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  parentCommentId,
  comment,
  onCommentAdded,
  onCancelEdit,
}) => {
  const [content, setContent] = useState<string>('');
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
  }, [comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment) {
      const updatedComment: UpdateComment = { content };
      await updateComment(comment.id, updatedComment);
    } else {
      const newComment: CreateComment = { content, articleId, parentCommentId };
      await createComment(newComment);
    }

    setContent('');
    onCommentAdded();
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {state.isAuthenticated ? (
        <>
          <TextField
            multiline
            minRows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Write your comment...'
            variant='outlined'
            fullWidth
            disabled={state.user?.role === UserRole.ROLE_ADMIN}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              type='submit'
              variant='outlined'
              size='small'
              disabled={state.user?.role === UserRole.ROLE_ADMIN}
            >
              {comment ? 'Update Comment' : 'Add Comment'}
            </Button>
            {onCancelEdit && (
              <Button
                variant='outlined'
                color='warning'
                size='small'
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Card className='card-with-line'>
          <CardContent>
            <Typography variant='body2'>
              <Link
                component='button'
                type='button'
                underline='none'
                onClick={() => router.push('/sign-up')}
                sx={{ mr: '5px', verticalAlign: 'unset' }}
              >
                Sign up
              </Link>
              to leave a comment.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
