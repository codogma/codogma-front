import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { ArticleProgressBar } from '@/components/ArticleProgressBar';
import { useAuth } from '@/components/AuthProvider';
import MenuButton from '@/components/MenuButton';
import { getArticleById, like, unlike } from '@/helpers/articleApi';
import { GetArticle, Language } from '@/types';

type SearchProps = {
  readonly id: number;
  readonly lang: Language;
  readonly articleData: GetArticle;
};

export const ArticleActions = ({ id, lang, articleData }: SearchProps) => {
  const { state } = useAuth();

  const { data: article, refetch } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    initialData: articleData,
  });

  const handleClick = () => {
    const commentElement = document.getElementById(`comments`);
    if (commentElement) {
      commentElement.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (state.isAuthenticated) {
      if (checked) {
        await like(id).then(() => refetch());
      } else {
        await unlike(id).then(() => refetch());
      }
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
        checked={article.isLiked}
        onChange={handleChange}
        icon={
          <>
            <ThumbUpOutlinedIcon />
            <div className='ml-1 text-base leading-5'>{article.likeCount}</div>
          </>
        }
        checkedIcon={
          <>
            <ThumbUpOutlinedIcon color='inherit' />
            <div className='ml-1 text-base leading-5'>{article.likeCount}</div>
          </>
        }
        inputProps={{ 'aria-label': 'Like' }}
      />
      <IconButton
        onClick={handleClick}
        aria-label='Comments'
        sx={{ borderRadius: 8 }}
      >
        <CommentOutlinedIcon />
        <div className='ml-1 text-base leading-5'>{article.commentsCount}</div>
      </IconButton>
      <MenuButton article={article} lang={lang} />
      <ArticleProgressBar lang={lang} articleData={articleData} />
    </Paper>
  );
};
