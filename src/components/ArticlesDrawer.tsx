import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DefaultImage } from '@/components/DefaultImage';
import { DrawerHeader } from '@/components/DrawerHeader';
import MenuButton from '@/components/MenuButton';
import { useNavigation } from '@/components/NavigationProvider';
import { Scrollbar, useScrollContext } from '@/components/Scrollbar';
import { getArticles } from '@/helpers/articleApi';
import { Language } from '@/types';

type ArticlesDrawerProps = {
  readonly lang: Language;
  readonly articleId: string;
  readonly compilationId: string;
};

export const ArticlesDrawer = ({
  lang,
  articleId,
  compilationId,
}: ArticlesDrawerProps) => {
  const [openArticles, setOpenArticles] = useState<boolean>(false);
  const { isFullscreen } = useNavigation();
  const { instance } = useScrollContext();
  const router = useRouter();

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
      enabled: !!compilationId,
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

  const handleArticleClick = useCallback(
    (url: string) => {
      router.push(url);
      instance?.elements().viewport?.scrollTo(0, 0);
      setOpenArticles(false);
    },
    [router, instance],
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
                      item.image &&
                      `${process.env.NEXT_PUBLIC_BASE_URL}${item.image.imageUrl}`
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

  return compilationId ? (
    <>
      <Tooltip
        title='Список статей'
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
          onClick={() => setOpenArticles(true)}
        >
          <BallotOutlinedIcon />
        </IconButton>
      </Tooltip>
      {ArticlesDrawer}
    </>
  ) : null;
};
