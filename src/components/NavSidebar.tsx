'use client';
import { Box, Drawer } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

import { ArticlesDrawer } from '@/components/ArticlesDrawer';
import { FullscreenButton } from '@/components/FullscreenButton';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { Language } from '@/types';

type NavSidebarProps = {
  readonly lang: Language;
};

export const NavSidebar = ({ lang }: NavSidebarProps) => {
  const { articleId, compilationId } = useParams<{
    articleId: string;
    compilationId: string;
  }>();

  return (
    <Box component='nav'>
      <Drawer
        anchor='right'
        variant='permanent'
        open
        sx={{
          '& .MuiDrawer-paper': {
            paddingY: 1,
            gap: 1,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100vh',
          },
        }}
      >
        <FullscreenButton />
        <SettingsDrawer />
        <ArticlesDrawer
          lang={lang}
          articleId={articleId}
          compilationId={compilationId}
        />
      </Drawer>
    </Box>
  );
};
