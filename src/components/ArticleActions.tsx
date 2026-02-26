import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { HTMLAttributes } from 'react';

import { ArticleProgressBar } from '@/components/ArticleProgressBar';
import { ArticlesDrawer } from '@/components/ArticlesDrawer';
import { FullscreenButton } from '@/components/FullscreenButton';
import MenuButton from '@/components/MenuButton';
import { TOCDrawer } from '@/components/TOCDrawer';
import { getArticleById, like, unlike } from '@/helpers/articleApi';
import { TocItem } from '@/helpers/parseToc';
import { getQueryClient } from '@/lib/react-query';
import { GetArticle, Language } from '@/types';

type SearchProps = {
  readonly lang: Language;
  readonly article: GetArticle;
  readonly toc: TocItem[];
  readonly isFullscreen: boolean;
};

const CheckboxIconRoot = React.forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function CheckboxIconRoot(props, ref) {
  const { className, children, ...rest } = props;

  return (
    <span
      ref={ref}
      {...rest}
      className={['inline-flex items-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
});

export const ArticleActions = ({
  lang,
  article,
  toc,
  isFullscreen,
}: SearchProps) => {
  const { status } = useSession();
  const queryClient = getQueryClient();

  const { articleId, compilationId } = useParams<{
    articleId: string;
    compilationId: string;
  }>();

  const { data: articleData } = useQuery({
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

  const likeMutation = useMutation({
    mutationFn: () => like(article.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: ['recentlyArticles'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['history'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['articles'],
        refetchType: 'inactive',
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlike(article.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: ['recentlyArticles'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['history'],
        refetchType: 'inactive',
      });
      await queryClient.invalidateQueries({
        queryKey: ['articles'],
        refetchType: 'inactive',
      });
    },
  });

  const handleChange = async (_event: React.ChangeEvent, checked: boolean) => {
    if (status === 'authenticated') {
      if (checked) {
        await likeMutation.mutateAsync();
      } else {
        await unlikeMutation.mutateAsync();
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
        m: isFullscreen ? 0 : '8px auto',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      variant='outlined'
      aria-label='Article Actions'
    >
      {isFullscreen ? (
        <>
          <FullscreenButton />
          <ArticlesDrawer
            lang={lang}
            articleId={articleId}
            compilationId={compilationId}
          />
          {toc.length !== 0 && <TOCDrawer article={article} toc={toc} />}
        </>
      ) : (
        <>
          <FullscreenButton />
          <Checkbox
            checked={articleData.isLiked}
            onChange={handleChange}
            icon={
              <CheckboxIconRoot>
                <ThumbUpOutlinedIcon />
                <div className='ml-1 text-base leading-5'>
                  {articleData.likesCount}
                </div>
              </CheckboxIconRoot>
            }
            checkedIcon={
              <CheckboxIconRoot>
                <ThumbUpOutlinedIcon color='inherit' />
                <div className='ml-1 text-base leading-5'>
                  {articleData.likesCount}
                </div>
              </CheckboxIconRoot>
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
          {toc.length !== 0 && <TOCDrawer article={article} toc={toc} />}
          <ArticlesDrawer
            lang={lang}
            articleId={articleId}
            compilationId={compilationId}
          />
          <MenuButton article={articleData} lang={lang} />
          <ArticleProgressBar article={article} />
        </>
      )}
    </Paper>
  );
};
