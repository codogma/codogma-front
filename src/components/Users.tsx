'use client';
import Grid from '@mui/material/Grid';
import React from 'react';

import { UserCard } from '@/components/UserCard';
import { GetUserDTO, Language } from '@/types';

type AuthorsProps = {
  readonly users: GetUserDTO[];
  readonly isLoading?: boolean;
  readonly usersPerPageStart: number;
  readonly lang: Language;
};

export default function Users({
  users,
  isLoading,
  usersPerPageStart,
  lang,
}: AuthorsProps) {
  return (
    <Grid container spacing={2}>
      {(isLoading ? Array.from(new Array(usersPerPageStart)) : users)?.map(
        (user: GetUserDTO, key) => (
          <Grid
            key={user ? user.id : `skeleton-${key}`}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <UserCard user={user} lang={lang} />
          </Grid>
        ),
      )}
    </Grid>
  );
}
