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
        <Grid container spacing={2} rowGap={0} direction='row' columns={30}>
          <Grid size={{ lg: 5, md: 3, sm: 0 }}>
            <NavPanel lang={lang} />
          </Grid>
          <Grid size={{ lg: 25, md: 27, sm: 30 }}>{children}</Grid>
        </Grid>
      </Container>
      <BottomNavigation lang={lang} />
    </Box>
  );
};
