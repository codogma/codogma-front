'use client';
import { Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
      {(loading ? Array.from(new Array(12)) : articles)?.map((article) => (
        <Grid key={article.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          {article ? (
            <ArticleCard article={article} lang={lang} />
          ) : (
            <Card variant='outlined' sx={{ width: '100%', p: 2 }}>
              <CardContent>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Skeleton variant='rounded' width={40} height={40} />
                  <div style={{ flex: 1 }}>
                    <Skeleton
                      variant='text'
                      width='40%'
                      height={20}
                      sx={{ mt: 0.5 }}
                    />
                    <Skeleton variant='text' width='60%' height={24} />
                  </div>
                </div>
                <Skeleton
                  variant='rectangular'
                  width='100%'
                  height={160}
                  sx={{ mt: 2, borderRadius: 1 }}
                />
                <Skeleton variant='text' width='80%' sx={{ mt: 2 }} />
                <Skeleton variant='text' width='60%' sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  );
}
