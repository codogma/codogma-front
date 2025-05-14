'use client';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import BookIcon from '@mui/icons-material/Book';
import HistoryIcon from '@mui/icons-material/History';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, TabOwnProps } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useT } from '@/app/i18n/client';
import { Carousel } from '@/components/Carousel';
import Compilations from '@/components/Compilations';
import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import { GetArticlesDTO, getViewed } from '@/helpers/articleApi';
import { getCompilations, GetCompilationsDTO } from '@/helpers/compilationApi';
import { Language } from '@/types';

type MainTabsProps = {
  readonly lang: Language;
  readonly username?: string;
};

type MainTab = {
  value: string;
  label: string;
  icon: TabOwnProps['icon'];
};

export const MainTabs: React.FC<MainTabsProps> = ({ lang, username }) => {
  const [value, setValue] = useState<number>(0);
  const { t } = useT(lang);
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

  const tabs: MainTab[] = [
    { value: '1', label: t('history'), icon: <HistoryIcon /> },
    { value: '2', label: t('bookmarks'), icon: <BookIcon /> },
    {
      value: '3',
      label: t('myCompilations'),
      icon: <MyCompilationsBadge />,
    },
  ];

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const listNode = entry.target.querySelector(
          '[role="tablist"]',
        ) as HTMLElement;
        setOverflow(listNode.scrollWidth > listNode.clientWidth);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const { data: viewedData, isFetching: isFetchingViewed } =
    useQuery<GetArticlesDTO>({
      queryKey: ['history'],
      queryFn: () => {
        return getViewed();
      },
    });

  const history = viewedData?.content ?? [];

  const { data: bookmarksData, isFetching: isFetchingBookmarks } =
    useQuery<GetCompilationsDTO>({
      queryKey: ['bookmarks'],
      queryFn: () => {
        return getCompilations(undefined, undefined, undefined, true, 0, 5);
      },
    });

  const bookmarks = bookmarksData?.content ?? [];

  const { data: myCompilationsData, isFetching: isFetchingMyCompilations } =
    useQuery<GetCompilationsDTO>({
      queryKey: ['compilations', username],
      queryFn: () => {
        return getCompilations(undefined, undefined, username, false, 0, 5);
      },
    });

  const myCompilations = myCompilationsData?.content ?? [];

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [],
  );

  return (
    <div ref={ref} className='nav-tabs'>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            variant={overflow ? 'scrollable' : 'standard'}
            scrollButtons={overflow ? 'auto' : false}
            allowScrollButtonsMobile={overflow}
            aria-label='scrollable force tabs example'
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                iconPosition='start'
                label={tab.label}
                sx={{ minHeight: '48px', textTransform: 'none' }}
              />
            ))}
          </TabList>
        </Box>
        <TabPanel value={0}>
          <Carousel
            articles={history}
            isLoading={isFetchingViewed}
            lang={lang}
          />
          <Link href={`/${lang}/users/${username}/history`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon />
              {t('historyLink')}
            </Box>
          </Link>
        </TabPanel>
        <TabPanel value={1}>
          <Compilations
            compilations={bookmarks}
            loading={isFetchingBookmarks}
            lang={lang}
          />
          <Link href={`/${lang}/bookmarks`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon />
              {t('bookmarksLink')}
            </Box>
          </Link>
        </TabPanel>
        <TabPanel value={2}>
          <Compilations
            compilations={myCompilations}
            loading={isFetchingMyCompilations}
            lang={lang}
          />
          <Link href={`/${lang}/my-compilations`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon />
              {t('myCompilationsLink')}
            </Box>
          </Link>
        </TabPanel>
      </TabContext>
    </div>
  );
};
