'use client';

import Grid from '@mui/material/Grid';
import React from 'react';

import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type ArticlesProps = {
  readonly lang: Language;
  readonly articles: GetArticle[];
  readonly articlesPerPageStart: number;
  readonly isLoading: boolean;
};

export const Articles = ({
  lang,
  articles,
  articlesPerPageStart,
  isLoading,
}: ArticlesProps) => {
  const items: Array<GetArticle | null> = isLoading
    ? Array.from({ length: articlesPerPageStart }, () => null)
    : articles;

  return (
    <Grid container spacing={2}>
      {items.map((article, key) => (
        <Grid
          key={article ? article.id : `skeleton-${key}`}
          size={{ xs: 12, sm: 6, lg: 4 }}
        >
          <ArticleCard article={article} lang={lang} />
        </Grid>
      ))}
    </Grid>
  );
};
