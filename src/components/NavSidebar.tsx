'use client';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { Scrollbar, useScrollContext } from '@/components/Scrollbar';
import { getArticles } from '@/helpers/articleApi';
import { TocItem } from '@/helpers/parseToc';
import { GetArticle, GetCompilation, Language } from '@/types';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  color: theme.palette.action.active,
  ...theme.mixins.toolbar,
}));

type NavSidebarProps = {
  readonly lang: Language;
  readonly article: GetArticle | undefined;
  readonly toc: TocItem[];
  readonly compilation?: GetCompilation;
};

export const NavSidebar = ({
  lang,
  article,
  toc,
  compilation,
}: NavSidebarProps) => {
  const { instance } = useScrollContext();
  const pathname = usePathname();
  const { articleId, compilationId } = useParams<{
    articleId: string;
    compilationId: string;
  }>();
  const [openArticles, setOpenArticles] = useState<boolean>(false);
  const [openContents, setOpenContents] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation(lang, 'articles');

  const handleArticleClick = useCallback(
    (url: string) => {
      router.push(url);
      instance?.elements().viewport?.scrollTo(0, 0);
      setOpenArticles(false);
    },
    [router, instance],
  );

  const removeFlashHighlight = useCallback(async () => {
    if (!instance) return;
    const viewport = instance.elements().viewport;
    if (!viewport) return;
    const contentRoot = viewport.querySelector('.article-content');
    if (contentRoot) {
      const anchors = contentRoot.querySelectorAll('.flash-highlight');
      anchors.forEach((el) => {
        el.classList.remove('flash-highlight');
        if (el.classList.length === 0) {
          el.removeAttribute('class');
        }
      });
    }
  }, []);

  const handleTopAnchorClick = useCallback(async () => {
    setOpenContents(false);
    if (!instance) return;
    const viewport = instance.elements().viewport;
    if (!viewport) return;
    router.push(pathname, { scroll: false });
    await removeFlashHighlight();
    const anchor = viewport.querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [instance, pathname, removeFlashHighlight, router]);

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['articles', compilationId],
      queryFn: ({ pageParam = 0 }) =>
        getArticles(undefined, Number(compilationId), pageParam, 5),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.number + 1 < lastPage.totalPages
          ? lastPage.number + 1
          : undefined,
      enabled: !!compilation,
    });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page?.content) || [],
    [data],
  );

  const isSelectedHeader = useCallback((id: string) => {
    if (window.location.hash) {
      const headerId = window.location.hash.substring(1);
      return headerId === id;
    }
  }, []);

  const ArticlesDrawer = (
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
      onClose={() => setOpenArticles(false)}
      onKeyDown={() => setOpenArticles(false)}
      open={openArticles}
      slotProps={{
        root: {
          keepMounted: true,
        },
      }}
    >
      <DrawerHeader>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <BallotOutlinedIcon />
          <Typography variant='h6'>{t('listOfArticles')}:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenArticles(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}>
        <List dense component='nav'>
          {articles.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={<MenuButton lang={lang} article={item} />}
              disablePadding
            >
              <ListItemButton
                onClick={() =>
                  handleArticleClick(
                    `/${lang}/compilations/${compilationId}/${item.id}`,
                  )
                }
                selected={articleId === item.id.toString()}
              >
                <ListItemAvatar
                  sx={{
                    height: 50,
                    aspectRatio: '16/9',
                    mr: 2,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <DefaultImage
                    src={
                      item.imageUrl &&
                      `${process.env.NEXT_PUBLIC_BASE_URL}${item.imageUrl}`
                    }
                    top={0}
                    left={0}
                    zIndex={0}
                    className='scale-x-100 transition-transform will-change-transform'
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Typography
                    variant='subtitle1'
                    sx={{
                      flexGrow: 1,
                      lineHeight: 1.2,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.title}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Scrollbar>
    </Drawer>
  );

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
          <Typography variant='h6'>{t('tableOfContents')}:</Typography>
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
  const SettingsDrawer = (
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
      onClose={() => setOpenSettings(false)}
      onKeyDown={() => setOpenSettings(false)}
      open={openSettings}
      slotProps={{
        root: {
          keepMounted: true,
        },
      }}
    >
      <DrawerHeader>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <SettingsApplicationsOutlinedIcon />
          <Typography variant='h6'>{t('settings')}:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenSettings(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}></Scrollbar>
    </Drawer>
  );

  return (
    <Box component='nav'>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
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
        <Box paddingTop={1}>
          <Tooltip
            title={t('hideNavigation')}
            arrow
            placement='left'
            sx={{ display: 'block' }}
          >
            <IconButton
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FullscreenOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip
            title={t('settings')}
            arrow
            placement='left'
            sx={{ display: 'block' }}
          >
            <IconButton
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setOpenSettings(true)}
            >
              <SettingsApplicationsOutlinedIcon />
            </IconButton>
          </Tooltip>
          {SettingsDrawer}
        </Box>
        {!!compilationId && (
          <Box>
            <Tooltip
              title={t('listOfArticles')}
              arrow
              placement='left'
              sx={{ display: 'block' }}
            >
              <IconButton
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setOpenArticles(true)}
              >
                <BallotOutlinedIcon />
              </IconButton>
            </Tooltip>
            {ArticlesDrawer}
          </Box>
        )}
        {toc.length !== 0 && (
          <Box>
            <Tooltip
              title={t('tableOfContents')}
              arrow
              placement='left'
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
          </Box>
        )}
      </Paper>
    </Box>
  );
};
