import Grid from '@mui/material/Grid';
import React from 'react';

import { CategoryCard } from '@/components/CategoryCard';
import { GetCategory, Language } from '@/types';

type CategoriesProps = {
  readonly categories: GetCategory[];
  readonly isLoading: boolean;
  readonly categoriesPerPageStart: number;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function Categories({
  categories,
  isLoading,
  categoriesPerPageStart,
  lang,
  refetch,
}: CategoriesProps) {
  return (
    <Grid container spacing={2}>
      {(isLoading
        ? Array.from(new Array(categoriesPerPageStart))
        : categories
      )?.map((category: GetCategory, key) => (
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
