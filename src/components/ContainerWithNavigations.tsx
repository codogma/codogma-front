'use client';
import { Box, Container, Grid2 as Grid } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

import BottomNavigation from '@/components/BottomNavigation';
import NavBar from '@/components/NavBar';
import { NavPanel } from '@/components/NavPanel';
import { Language } from '@/types';

type ContainerWithNavPanelProps = {
  readonly lang: Language;
  readonly children: ReactNode;
};

export const ContainerWithNavigations = ({
  lang,
  children,
}: ContainerWithNavPanelProps) => {
  const pathname = usePathname();
  const hasAdmin = pathname.startsWith(`/${lang}/admin`);
  if (hasAdmin) {
    return children;
  }
  return (
    <Box className='flex min-h-screen flex-col'>
      <NavBar lang={lang} />
      <Container maxWidth='xl'>
        <Grid container spacing={2} rowGap={0}>
          <NavPanel lang={lang} />
          <Grid size={{ lg: 10, md: 11, sm: 12 }}>{children}</Grid>
        </Grid>
      </Container>
      <BottomNavigation lang={lang} />
    </Box>
  );
};
