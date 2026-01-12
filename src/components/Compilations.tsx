import Grid from '@mui/material/Grid';
import React from 'react';

import { CompilationCard } from '@/components/CompilationCard';
import { GetCompilation, Language } from '@/types';

type CompilationsProps = {
  readonly compilations: GetCompilation[];
  readonly isLoading: boolean;
  readonly compilationsPerPageStart: number;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export default function Compilations({
  compilations,
  isLoading,
  compilationsPerPageStart,
  lang,
  refetch,
}: CompilationsProps) {
  return (
    <Grid container spacing={2}>
      {(isLoading
        ? Array.from(new Array(compilationsPerPageStart))
        : compilations
      )?.map((compilation: GetCompilation, key) => (
        <Grid
          key={compilation ? compilation.id : `skeleton-${key}`}
          size={{ xs: 12, sm: 6, lg: 4 }}
        >
          <CompilationCard
            compilation={compilation}
            lang={lang}
            refetch={refetch}
          />
        </Grid>
      ))}
    </Grid>
  );
}
