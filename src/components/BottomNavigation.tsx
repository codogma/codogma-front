'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  Paper,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';

type FixedBottomNavigationProps = {
  readonly lang: string;
};
export default function FixedBottomNavigation({
  lang,
}: FixedBottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState<'articles' | 'feed' | undefined>();
  const { t } = useTranslation(lang);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: 'articles' | 'feed',
  ) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (pathname === `/${lang}/articles`) {
      setValue('articles');
    } else if (pathname === `/${lang}/feed`) {
      setValue('feed');
    } else if (pathname === `/${lang}`) {
      setValue(undefined);
    }
  }, [lang, pathname]);

  const handleClick = (url: string) => {
    router.push(`/${lang}/${url}`);
  };

  return (
    <Box>
      <Drawer
        variant='permanent'
        sx={{
          pb: 7,
          display: { xs: 'block', md: 'none' },
          flexShrink: 0,
          whiteSpace: 'nowrap',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 200,
            top: 'initial',
            left: 'initial',
            bottom: 'initial',
          },
        }}
        open
      >
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation showLabels value={value} onChange={handleChange}>
            <BottomNavigationAction
              label={t('articles')}
              value='articles'
              icon={<ArticleIcon />}
              onClick={() => handleClick('articles')}
            />
            <BottomNavigationAction
              label={t('feed')}
              value='feed'
              icon={<PlaylistAddCheckCircleIcon />}
              onClick={() => handleClick('feed')}
            />
          </BottomNavigation>
        </Paper>
      </Drawer>
    </Box>
  );
}
