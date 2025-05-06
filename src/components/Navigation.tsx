'use client';
import { Container, Grid2 as Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ArticleActions } from '@/components/ArticleActions';
import Articles from '@/components/Articles';
import BottomNavigation from '@/components/BottomNavigation';
import { CommentList } from '@/components/CommentList';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { useNavigationState } from '@/components/NavigationProvider';
import { NavPanel } from '@/components/NavPanel';
import { NavSidebar } from '@/components/NavSidebar';
import { getRecommendationsArticleById } from '@/helpers/articleApi';
import { GetArticle, Language } from '@/types';

type NavigationProps = {
  readonly lang: Language;
  readonly children: ReactNode;
};

export const Navigation = ({ lang, children }: NavigationProps) => {
  const { article, toc, isFullscreen } = useNavigationState();
  const pathname = usePathname();
  const { articleId } = useParams();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);
  const { t } = useTranslation(lang, 'articles');

  const { data, isFetching } = useQuery<GetArticle>({
    queryKey: ['articles', article?.id],
    queryFn: () => getRecommendationsArticleById(article?.id),
    enabled: !!article?.id,
  });

  const articles: GetArticle[] = (data ?? []) as GetArticle[];
  const hasArticles = articles && articles.length > 0;

  if (hasAdmin) {
    return children;
  }

  return (
    <>
      {!isFullscreen && <NavBar lang={lang} />}
      <Container maxWidth='xl'>
        <Grid container spacing={1} direction='row' columns={12}>
          <Grid
            sx={{
              position: 'sticky',
              top: 64,
              height: { xs: 'auto', md: 'calc(100vh - 64px)' },
              overflow: 'hidden',
              display: { xs: 'none', md: isFullscreen ? 'none' : 'block' },
            }}
          >
            <NavPanel lang={lang} />
          </Grid>
          <Grid
            size={{ md: 'grow', xs: 12 }}
            columnGap={1}
            className='flex flex-col flex-wrap justify-between'
          >
            {children}
            {article && (
              <ArticleActions
                lang={lang}
                article={article}
                isFullscreen={isFullscreen}
              />
            )}
            {!isFullscreen && (
              <CommentList articleId={Number(articleId)} lang={lang} />
            )}
            {!isFullscreen && hasArticles && (
              <>
                <Typography component='div'>{t('recommendation')}</Typography>
                <Articles
                  lang={lang}
                  articles={articles}
                  loading={isFetching}
                />
              </>
            )}
            {!isFullscreen && <Footer lang={lang} />}
          </Grid>
          {!!articleId && (
            <Grid
              sx={{
                position: 'sticky',
                top: 64,
                height: { xs: 'auto', md: 'calc(100vh - 64px)' },
                overflow: 'hidden',
                display: { xs: 'none', md: isFullscreen ? 'none' : 'block' },
              }}
            >
              <NavSidebar lang={lang} article={article} toc={toc} />
            </Grid>
          )}
        </Grid>
      </Container>
      <BottomNavigation lang={lang} />
    </>
  );
};
