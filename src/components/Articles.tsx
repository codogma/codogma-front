'use client';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type ArticlesProps = {
  readonly lang: Language;
  readonly articles: GetArticle[];
  readonly articlesPerPageStart: number;
  readonly loading: boolean;
};

export const Articles = ({
  lang,
  articles,
  articlesPerPageStart,
  loading,
}: ArticlesProps) => {
  return (
    <Grid container spacing={2}>
      {(loading ? Array.from(new Array(articlesPerPageStart)) : articles)?.map(
        (article, key) => (
          <Grid
            key={article ? article.id : `skeleton-${key}`}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <ArticleCard article={article} lang={lang} />
          </Grid>
        ),
      )}
    </Grid>
  );
};
