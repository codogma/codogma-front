'use client';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { ArticleCard } from '@/components/ArticleCard';
import { GetArticle, Language } from '@/types';

type ArticlesProps = {
  readonly lang: Language;
  readonly articles: GetArticle[];
  readonly loading: boolean;
};

export default function Articles({ lang, articles, loading }: ArticlesProps) {
  return (
    <Grid container spacing={2}>
      {(loading ? Array.from(new Array(12)) : articles)?.map((article, key) => (
        <Grid key={key} size={{ xs: 12, sm: 6, lg: 4 }}>
          <ArticleCard article={article} lang={lang} />
        </Grid>
      ))}
    </Grid>
  );
}
