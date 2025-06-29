'use client';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { CategoryCard } from '@/components/CategoryCard';
import { GetCategory, Language } from '@/types';

type CategoriesProps = {
  readonly categories: GetCategory[];
  readonly loading: boolean;
  readonly categoriesPerPageStart: number;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function Categories({
  categories,
  loading,
  categoriesPerPageStart,
  lang,
  refetch,
}: CategoriesProps) {
  return (
    <Grid container spacing={2}>
      {(loading
        ? Array.from(new Array(categoriesPerPageStart))
        : categories
      )?.map((category, key) => (
        <Grid
          key={category ? category.id : `skeleton-${key}`}
          size={{ xs: 12, sm: 6, lg: 4 }}
        >
          <CategoryCard lang={lang} category={category} refetch={refetch} />
        </Grid>
      ))}
    </Grid>
  );
}
