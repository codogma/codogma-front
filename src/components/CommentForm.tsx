import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@/components/FormInput';
import { createComment, updateComment } from '@/helpers/commentAPI';
import { CreateComment, GetComment, UpdateComment } from '@/types';

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
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('commentForm');

  const CommentFormScheme = z.object({
    content: z
      .string()
      .min(10, t('minText', { length: 10 }))
      .max(1000, t('maxText', { length: 1000 })),
  });

  const zodForm = useForm<z.infer<typeof CommentFormScheme>>({
    resolver: zodResolver(CommentFormScheme),
    defaultValues: {
      content: comment?.content ?? '',
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = zodForm;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ content: '' });
    }
  }, [isSubmitSuccessful, reset, errors, zodForm]);

  useEffect(() => {
    if (comment) {
      setValue('content', comment.content);
    } else {
      setValue('content', '');
    }
  }, [comment, setValue]);

  const onSubmit: SubmitHandler<z.infer<typeof CommentFormScheme>> = async (
    formData,
  ) => {
    if (comment) {
      const updatedComment: UpdateComment = {
        content: formData.content,
      };
      await updateComment(comment.id, updatedComment);
    } else {
      const newComment: CreateComment = {
        content: formData.content,
        articleId,
        parentCommentId,
      };
      await createComment(newComment);
    }
    onCommentAdded();
  };

  return (
    <>
      {status === 'authenticated' ? (
        <FormProvider {...zodForm}>
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <FormInput
              multiline
              name='content'
              minRows={3}
              placeholder='Write your comment...'
              variant='outlined'
              fullWidth
              error={Boolean(errors.content?.message)}
              helperText={errors.content?.message}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button type='submit' variant='outlined' size='small'>
                {comment ? t('saveCommentBtn') : t('addCommentBtn')}
              </Button>
              {onCancelEdit && (
                <Button
                  variant='outlined'
                  color='warning'
                  size='small'
                  onClick={onCancelEdit}
                >
                  {t('cancelBtn')}
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
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
    </>
  );
};
