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
import { devConsoleInfo } from '@/helpers/devConsoleLogs';
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
  readonly article?: GetArticle;
  readonly compilation?: GetCompilation;
};

type TocItem = {
  id: string;
  text: string;
  level: number;
};

const parseToc = (html: string): TocItem[] => {
  if (typeof window === 'undefined') return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
    (element) => ({
      id: element.id,
      text: element.textContent ?? '',
      level: parseInt(element.tagName.substring(1), 10),
    }),
  );
};

export const NavSidebar = ({ lang, article, compilation }: NavSidebarProps) => {
  const { instance } = useScrollContext();
  const pathname = usePathname();
  const { compilationId } = useParams();
  const [openArticles, setOpenArticles] = useState<boolean>(false);
  const [openContents, setOpenContents] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const router = useRouter();
  const { t } = useTranslation(lang);

  const handleClickArticle = useCallback(
    (url: string) => {
      router.push(url);
      instance?.elements().viewport?.scrollTo(0, 0);
      setOpenArticles(false);
    },
    [router, instance],
  );

  const handleClickHeader = useCallback(
    (url: string) => {
      router.push(url);
      setOpenContents(false);
    },
    [router],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['articles', compilation?.id],
      queryFn: ({ pageParam = 0 }) =>
        getArticles(undefined, compilation?.id, pageParam, 5),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.number + 1 < lastPage.totalPages
          ? lastPage.number + 1
          : undefined,
      enabled: !!compilation,
    });

  useEffect(() => {
    devConsoleInfo(article);
    if (article?.content) {
      setToc(parseToc(article.content));
    }
  }, [article]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page?.content) || [],
    [data],
  );

  const currentCompilationPathArticle = useMemo(
    () => `/${lang}/compilations/${compilation?.id}/`,
    [lang, compilation?.id],
  );

  const isSelectedArticle = useCallback(
    (id: number) => pathname === `${currentCompilationPathArticle}${id}`,
    [currentCompilationPathArticle, pathname],
  );

  const currentCompilationPathHeader = useMemo(
    () => `/${lang}/compilations/${compilation?.id}/${article?.id}`,
    [lang, compilation?.id, article?.id],
  );

  const isSelectedHeader = useCallback(
    (id: string) => pathname === `${currentCompilationPathHeader}#${id}`,
    [currentCompilationPathHeader, pathname],
  );

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
          <Typography variant='h6'>Список статей:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenArticles(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}>
        <List dense>
          {articles.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={<MenuButton lang={lang} article={item} />}
              disablePadding
            >
              <ListItemButton
                onClick={() =>
                  handleClickArticle(
                    `/${lang}/compilations/${compilation?.id}/${item.id}`,
                  )
                }
                selected={isSelectedArticle(item.id)}
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
          <Typography variant='h6'>Оглавление:</Typography>
        </Stack>
        <IconButton onClick={() => setOpenContents(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Scrollbar style={{ height: '100%' }}>
        <List dense>
          {/*TODO реализовать Оглавление/Содержание с вложенными списками для статьи с якорными ссылками на основе заголовков h1-h6 с id в которых прописаны slug-и заголовков*/}
          {toc.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  handleClickHeader(
                    `/${lang}/compilations/${compilation?.id}/${article?.id}#${item.id}`,
                  )
                }
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
                      variant: item.level === 1 ? 'subtitle2' : 'body2',
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
          <Typography variant='h6'>Настройки:</Typography>
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
        {!!compilationId && (
          <Box paddingTop={1}>
            <Tooltip
              title='Список статей'
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
        <Box>
          <Tooltip
            title='Оглавление'
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
        <Box>
          <Tooltip
            title='Настройки'
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
        <Box>
          <Tooltip
            title='Скрыть навигацию'
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
      </Paper>
    </Box>
  );
};
