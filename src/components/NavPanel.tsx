'use client';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { replaceUrlAndDispatchEvent } from '@/helpers/replaceUrlAndDispatchEvent';

type NavPanelProps = {
  readonly lang: string;
};

export const NavPanel = ({ lang }: NavPanelProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));
  const { t } = useTranslation(lang);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (pathname === `/${lang}/articles`) {
      setActiveIndex(0);
    } else if (pathname === `/${lang}/feed`) {
      setActiveIndex(1);
    } else if (pathname === `/${lang}/compilations`) {
      setActiveIndex(2);
    } else if (pathname === `/${lang}`) {
      setActiveIndex(undefined);
    }
  }, [lang, pathname]);

  const items = [
    { text: t('articles'), href: `/${lang}/articles`, icon: <ArticleIcon /> },
    {
      text: t('feed'),
      href: `/${lang}/feed`,
      icon: <PlaylistAddCheckCircleIcon />,
    },
    {
      text: t('compilations'),
      href: `/${lang}/compilations`,
      icon: <ViewListIcon />,
    },
  ];

  const handleClick = (href: string) => {
    replaceUrlAndDispatchEvent(router, href);
  };

  return (
    <Box component='nav'>
      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            position: 'relative',
            height: { xs: 0, md: '100vh' },
          },
        }}
        open
        slotProps={{
          root: {
            keepMounted: true,
          },
        }}
      >
        <List sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {items.map(({ text, href, icon }, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <Tooltip
                title={text}
                arrow
                placement='right'
                sx={{ display: { sm: 'block', xl: 'none' } }}
                disableHoverListener={!isMin}
              >
                <Link href={href} scroll={false}>
                  <ListItemButton
                    sx={{
                      flexDirection: { xs: 'column', lg: 'row' },
                      display: 'flex',
                      alignItems: { xs: 'center', lg: 'left' },
                      justifyItems: { xs: 'center', lg: 'left' },
                    }}
                    onClick={() => {
                      handleClick(href);
                      setActiveIndex(index);
                    }}
                    selected={activeIndex === index}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: { xs: 0, lg: 1 },
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: {
                            xs: '0.75rem',
                            lg: '1rem',
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
