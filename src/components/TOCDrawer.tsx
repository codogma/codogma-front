import CloseIcon from '@mui/icons-material/Close';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { DrawerHeader } from '@/components/DrawerHeader';
import { useNavigation } from '@/components/NavigationProvider';
import { Scrollbar, useScrollContext } from '@/components/Scrollbar';
import { TocItem } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

type TOCDrawerProps = {
  readonly article: GetArticle | undefined;
  readonly toc: TocItem[];
};

export const TOCDrawer = ({ article, toc }: TOCDrawerProps) => {
  const [openContents, setOpenContents] = useState<boolean>(false);
  const { instance, scrollToTop } = useScrollContext();
  const { isFullscreen } = useNavigation();
  const pathname = usePathname();
  const router = useRouter();

  const removeFlashHighlight = useCallback(async () => {
    const viewport = instance?.elements().viewport;
    const contentRoot = viewport?.querySelector('.article-content');
    if (contentRoot) {
      const anchors = contentRoot.querySelectorAll('.flash-highlight');
      anchors.forEach((el) => {
        el.classList.remove('flash-highlight');
        if (el.classList.length === 0) {
          el.removeAttribute('class');
        }
      });
    }
  }, [instance]);

  const handleTopAnchorClick = useCallback(async () => {
    setOpenContents(false);
    router.push(pathname, { scroll: false });
    await removeFlashHighlight();
    scrollToTop();
  }, [pathname, removeFlashHighlight, router, scrollToTop]);

  const handleAnchorClick = useCallback(
    async (id: string) => {
      setOpenContents(false);
      router.push(`${pathname}#${id}`, { scroll: false });
      await removeFlashHighlight();
      if (!instance) return;
      const viewport = instance.elements().viewport;
      if (!viewport) return;
      const el = viewport.querySelector(`#${id}`);
      if (el) {
        el.classList.add('flash-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [instance, pathname, removeFlashHighlight, router],
  );

  const isSelectedHeader = useCallback((id: string) => {
    if (typeof window !== 'undefined') {
      const headerId = window.location.hash.substring(1);
      return headerId === id;
    }
  }, []);

  const TOCDrawer = (
    <Drawer
      anchor='right'
      sx={{
        display: 'block',
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          maxWidth: 600,
          height: '100vh',
        },
      }}
      onClose={() => setOpenContents(false)}
      onKeyDown={() => setOpenContents(false)}
      open={openContents}
      slotProps={{
        root: {
          keepMounted: true,
        },
      }}
    >
      <DrawerHeader>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <ListAltOutlinedIcon />
          <Typography variant='h6'>Оглавление:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenContents(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}>
        <List
          dense
          component='nav'
          aria-labelledby='toc-list-subheader'
          subheader={
            <ListItemButton
              id='toc-list-subheader'
              onClick={handleTopAnchorClick}
            >
              <ListItemText
                primary={article?.title}
                slotProps={{
                  primary: {
                    variant: 'subtitle1',
                    sx: { fontWeight: 600 },
                  },
                }}
              />
            </ListItemButton>
          }
        >
          {toc.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleAnchorClick(item.id)}
                selected={isSelectedHeader(item.id)}
                sx={{
                  pl: 2 * item.level,
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      variant: 'subtitle2',
                      sx: { fontWeight: item.level < 3 ? 600 : 400 },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Scrollbar>
    </Drawer>
  );

  return toc.length !== 0 ? (
    <>
      <Tooltip
        title='Оглавление'
        arrow
        placement={isFullscreen ? 'top' : 'left'}
        sx={{ display: 'block' }}
      >
        <IconButton
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpenContents(true)}
        >
          <ListAltOutlinedIcon />
        </IconButton>
      </Tooltip>
      {TOCDrawer}
    </>
  ) : null;
};
