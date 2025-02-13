import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import React, { useState } from 'react';

import { ArticleProgressBar } from '@/components/ArticleProgressBar';
import { useAuth } from '@/components/AuthProvider';
import { like } from '@/helpers/articleApi';
import { Article } from '@/types';

type SearchProps = {
  readonly id: number;
  readonly lang: string;
  readonly articleData: Article;
  readonly isLikedValue?: boolean;
  readonly refetch?: () => void;
};

export const ArticleActions = ({
  id,
  lang,
  isLikedValue,
  articleData,
  refetch,
}: SearchProps) => {
  const [isLiked, setIsLiked] = useState(isLikedValue);
  const { state } = useAuth();

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (state.isAuthenticated) {
      setIsLiked(checked);
      await like(id).then(() => refetch && refetch());
    }
  };

  return (
    <Paper
      sx={{
        position: 'sticky',
        bottom: 20,
        minWidth: 100,
        width: 'fit-content',
        height: 52,
        zIndex: 10,
        boxSizing: 'border-box',
        background: 'rgba(86,95,102,0.8)',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        p: '6px',
        m: '0px auto 8px auto',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      variant='outlined'
      aria-label='Article Actions'
    >
      <Checkbox
        checked={isLiked}
        onChange={handleChange}
        icon={<ThumbUpOutlinedIcon />}
        checkedIcon={
          <ThumbUpOutlinedIcon color='inherit'>
            {articleData.likeCount}
          </ThumbUpOutlinedIcon>
        }
        inputProps={{ 'aria-label': 'Like' }}
      />
      <IconButton
        aria-label='Comments'
        color='inherit'
        sx={{ borderRadius: 8 }}
      >
        <CommentOutlinedIcon />
        <div className='ml-1 text-base leading-5'>
          {articleData.commentsCount}
        </div>
      </IconButton>
      <ArticleProgressBar lang={lang} articleData={articleData} />
    </Paper>
  );
};
