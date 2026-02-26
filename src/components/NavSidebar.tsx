'use client';
import { Box } from '@mui/material';
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
    <Box
      component='nav'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        py: 1.5,
      }}
    >
      <FullscreenButton />
      <SettingsDrawer />
      <ArticlesDrawer
        lang={lang}
        articleId={articleId}
        compilationId={compilationId}
      />
    </Box>
  );
};
