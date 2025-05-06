'use client';
import { Box, Paper } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

import { ArticlesDrawer } from '@/components/ArticlesDrawer';
import { FullscreenButton } from '@/components/FullscreenButton';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { TOCDrawer } from '@/components/TOCDrawer';
import { TocItem } from '@/helpers/parseToc';
import { GetArticle, Language } from '@/types';

type NavSidebarProps = {
  readonly lang: Language;
  readonly article: GetArticle | undefined;
  readonly toc: TocItem[];
};

export const NavSidebar = ({ lang, article, toc }: NavSidebarProps) => {
  const { articleId, compilationId } = useParams<{
    articleId: string;
    compilationId: string;
  }>();

  return (
    <Box component='nav'>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingY: 1,
          gap: 1,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100vh',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 0,
          width: 40,
          overflow: 'hidden',
        }}
      >
        <FullscreenButton />
        <SettingsDrawer />
        <ArticlesDrawer
          lang={lang}
          articleId={articleId}
          compilationId={compilationId}
        />
        <TOCDrawer article={article} toc={toc} />
      </Paper>
    </Box>
  );
};
