'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useT } from '@/app/i18n/client';
import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';
import { Language } from '@/types';

type FixedBottomNavigationProps = {
  readonly lang: Language;
};
export default function FixedBottomNavigation({
  lang,
}: FixedBottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<
    'articles' | 'feed' | 'compilations' | undefined
  >();
  const { t } = useT(lang);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: 'articles' | 'feed' | 'compilations',
  ) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (pathname === `/${lang}/articles`) {
      setValue('articles');
    } else if (pathname === `/${lang}/feed`) {
      setValue('feed');
    } else if (pathname === `/${lang}/compilations`) {
      setValue('compilations');
    } else if (pathname === `/${lang}`) {
      setValue(undefined);
    }
  }, [lang, pathname]);

  const items = [
    { value: 'articles', href: `/${lang}/articles`, icon: <ArticleIcon /> },
    {
      value: 'feed',
      href: `/${lang}/feed`,
      icon: <PlaylistAddCheckCircleIcon />,
    },
    {
      value: 'compilations',
      href: `/${lang}/compilations`,
      icon: <ViewListIcon />,
    },
  ];

  const handleClick = (href: string) => {
    replaceUrlAndDispatchEvent(router, href);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 10,
      }}
    >
      <Paper elevation={3}>
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          {items.map(({ value, href, icon }, index) => (
            <BottomNavigationAction
              key={index}
              label={t(value)}
              value={value}
              icon={icon}
              onClick={() => handleClick(href)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
