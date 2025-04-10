'use client';
import { Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import CategoryCard from '@/components/CategoryCard';
import { GetCategory, Language } from '@/types';

type CategoriesProps = {
  readonly categories: GetCategory[];
  readonly loading: boolean;
  readonly lang: Language;
};

export default function Categories({
  categories,
  loading,
  lang,
}: CategoriesProps) {
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  return (
    <>
      {loading ? (
        <Card variant='outlined' className='card'>
          <CardContent className='card-content'>
            <div className='card-header'>
              <Skeleton variant='rounded' width={48} height={48} />
              <ul>
                <li>
                  <Skeleton variant='text' width={100} />
                </li>
                <li>
                  <Skeleton variant='text' width={150} />
                </li>
                <li>
                  <Skeleton variant='text' width={150} />
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Grid container direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CategoryCard category={category} lang={lang} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
