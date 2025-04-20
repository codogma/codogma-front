'use client';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import BookIcon from '@mui/icons-material/Book';
import HistoryIcon from '@mui/icons-material/History';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, TabOwnProps } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Carousel } from '@/components/Carousel';
import Compilations from '@/components/Compilations';
import { CustomPagination } from '@/components/CustomPagination';
import { MyCompilationsBadge } from '@/components/MyCompilationsBadge';
import { Search } from '@/components/Search';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
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
  const [value, setValue] = React.useState('1');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(12);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');
  const { t } = useTranslation(lang);

  const tabs: MainTab[] = [
    { value: '1', label: t('history'), icon: <HistoryIcon /> },
    { value: '2', label: t('bookmarks'), icon: <BookIcon /> },
    {
      value: '3',
      label: t('myCompilations'),
      icon: <MyCompilationsBadge />,
    },
  ];

  const onSearchType = (type: string) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data: viewedData, isFetching: isFetchingViewed } =
    useQuery<GetArticlesDTO>({
      queryKey: [
        'history',
        currentPage,
        resultsPerPage,
        searchType,
        searchValue,
      ],
      queryFn: () => {
        return getArticles(undefined, undefined, 0, 5);
      },
    });

  const history = viewedData?.content ?? [];
  const totalPages = viewedData?.totalPages ?? 0;
  const totalElements = viewedData?.totalElements ?? 0;

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className='nav-tabs'>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
            aria-label='scrollable force tabs example'
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                iconPosition='start'
                label={tab.label}
                value={tab.value}
                sx={{ minHeight: '48px', textTransform: 'none' }}
              />
            ))}
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Search
            lang={lang}
            onSearchType={onSearchType}
            onSearchValue={onSearchValue}
          />
          <Carousel
            articles={history}
            isLoading={isFetchingViewed}
            lang={lang}
          />
          <CustomPagination
            lang={lang}
            totalPages={totalPages}
            totalElements={totalElements}
            resultsPerPageStart={resultsPerPage}
            onCurrentPageChange={onPageChange}
            onResultsPerPageChange={onResultsPerPageChange}
          />

          <Link href={`/${lang}/users/${username}/history`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon sx={{ mr: 1 }} />
              {t('historyLink')}
            </Box>
          </Link>
        </TabPanel>
        <TabPanel value='2'>
          <Compilations
            compilations={bookmarks}
            loading={isFetchingBookmarks}
            lang={lang}
          />
          <Link href={`/${lang}/bookmarks`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon sx={{ mr: 1 }} />
              {t('bookmarksLink')}
            </Box>
          </Link>
        </TabPanel>
        <TabPanel value='3'>
          <Compilations
            compilations={myCompilations}
            loading={isFetchingMyCompilations}
            lang={lang}
          />
          <Link href={`/${lang}/my-compilations`}>
            <Box className='link'>
              <ArrowCircleRightOutlinedIcon sx={{ mr: 1 }} />
              {t('myCompilationsLink')}
            </Box>
          </Link>
        </TabPanel>
      </TabContext>
    </Box>
  );
};
