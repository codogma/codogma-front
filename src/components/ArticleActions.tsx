import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { ArticleProgressBar } from '@/components/ArticleProgressBar';
import { useAuth } from '@/components/AuthProvider';
import { FullscreenButton } from '@/components/FullscreenButton';
import MenuButton from '@/components/MenuButton';
import { useNavigationState } from '@/components/NavigationProvider';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { TOCDrawer } from '@/components/TOCDrawer';
import { getArticleById, like, unlike } from '@/helpers/articleApi';
import { GetArticle, Language } from '@/types';

type SearchProps = {
  readonly lang: Language;
  readonly article: GetArticle;
  readonly isFullscreen: boolean;
};

export const ArticleActions = ({
  lang,
  article,
  isFullscreen,
}: SearchProps) => {
  const { toc } = useNavigationState();
  const { state } = useAuth();

  const { data: articleData, refetch } = useQuery({
    queryKey: ['article', article.id],
    queryFn: () => getArticleById(article.id),
    initialData: article,
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
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (state.isAuthenticated) {
      if (checked) {
        await like(article.id).then(() => refetch());
      } else {
        await unlike(article.id).then(() => refetch());
      }
    }
  };

  return (
    <Paper
      sx={{
        position: isFullscreen ? 'fixed' : 'sticky',
        bottom: { xs: isFullscreen ? 20 : 60, md: 20 },
        minWidth: 100,
        left: isFullscreen ? '50%' : 0,
        transform: isFullscreen ? 'translateX(-50%)' : 'none',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'fit-content',
        height: 52,
        zIndex: 10,
        boxSizing: 'border-box',
        background: 'rgba(86,95,102,0.8)',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        p: '6px',
        m: isFullscreen ? 0 : '8px auto 8px auto',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      variant='outlined'
      aria-label='Article Actions'
    >
      {isFullscreen ? (
        <>
          <FullscreenButton />
          <SettingsDrawer />
          <TOCDrawer article={article} toc={toc} />
        </>
      ) : (
        <>
          <Checkbox
            checked={articleData.isLiked}
            onChange={handleChange}
            icon={
              <>
                <ThumbUpOutlinedIcon />
                <div className='ml-1 text-base leading-5'>
                  {articleData.likeCount}
                </div>
              </>
            }
            checkedIcon={
              <>
                <ThumbUpOutlinedIcon color='inherit' />
                <div className='ml-1 text-base leading-5'>
                  {articleData.likeCount}
                </div>
              </>
            }
            slotProps={{ input: { 'aria-label': 'Like' } }}
          />
          <IconButton
            onClick={handleClick}
            aria-label='Comments'
            sx={{ borderRadius: 8 }}
          >
            <CommentOutlinedIcon />
            <div className='ml-1 text-base leading-5'>
              {articleData.commentsCount}
            </div>
          </IconButton>
        </>
      )}
      <MenuButton article={articleData} lang={lang} />
      <ArticleProgressBar article={article} />
    </Paper>
  );
};
