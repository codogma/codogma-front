'use client';
import { Box, Drawer } from '@mui/material';
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
      <Drawer
        anchor='right'
        variant='permanent'
        keepMounted
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
        <TOCDrawer article={article} toc={toc} />
      </Drawer>
    </Box>
  );
};
