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
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';

type NavPanelProps = {
  readonly lang: string;
};

export const NavPanel = ({ lang }: NavPanelProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMin = useMediaQuery(theme.breakpoints.down('lg'));
  const { t } = useTranslation(lang);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const drawerWidth = isMin ? theme.spacing(7) : 'auto';

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

  return (
    <Grid size={{ lg: 2, md: 1, sm: 0 }}>
      <Box component='nav' sx={{ width: drawerWidth }}>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', md: 'block' },
            flexShrink: 0,
            whiteSpace: 'nowrap',
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: 'initial',
              left: 'initial',
              bottom: 'initial',
            },
          }}
          open
        >
          <List>
            {items.map(({ text, href, icon }, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <Tooltip
                  title={text}
                  arrow
                  placement='right'
                  sx={{ display: { sm: 'block', xl: 'none' } }}
                  disableHoverListener={!isMin}
                >
                  <Link href={href}>
                    <ListItemButton
                      onClick={() => setActiveIndex(index)}
                      selected={activeIndex === index}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ opacity: isMin ? 0 : 1 }}
                      />
                    </ListItemButton>
                  </Link>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </Grid>
  );
};
