import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import React from 'react';

import { ArticleProgressBar } from '@/components/ArticleProgressBar';
import { Article } from '@/types';

type SearchProps = {
  readonly lang: string;
  readonly articleData: Article;
};

export const ArticleActions = ({ lang, articleData }: SearchProps) => {
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
      <IconButton aria-label='Like' color='inherit' sx={{ borderRadius: 8 }}>
        <ThumbUpOutlinedIcon />
        <div className='ml-1 text-base leading-5'>{articleData.likeCount}</div>
      </IconButton>
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
