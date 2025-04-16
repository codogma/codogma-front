'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import BookIcon from '@mui/icons-material/Book';
import HistoryIcon from '@mui/icons-material/History';
import ViewListIcon from '@mui/icons-material/ViewList';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { TabOwnProps } from '@mui/material/Tab/Tab';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Carousel } from '@/components/Carousel';
import Compilations from '@/components/Compilations';
import { GetArticlesDTO, getViewed } from '@/helpers/articleApi';
import { getCompilations, GetCompilationsDTO } from '@/helpers/compilationApi';
import { Language } from '@/types';

type MainTabsProps = {
  readonly icon: TabOwnProps['icon'];
  readonly lang: Language;
  readonly username?: string;
};

export const MainTabs: React.FC<MainTabsProps> = ({ lang, username }) => {
  const [value, setValue] = React.useState('1');
  // const router = useRouter();
  const { t } = useTranslation(lang);

  const { data: viewedData, isFetching: isFetchingViewed } =
    useQuery<GetArticlesDTO>({
      queryKey: ['articles'],
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className='nav-tabs'>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='tabs'>
          <TabList
            onChange={handleChange}
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
            aria-label='scrollable force tabs example'
          >
            <Tab
              icon={<HistoryIcon />}
              iconPosition='start'
              label={t('history')}
              value='1'
              sx={{ minHeight: 'auto', textTransform: 'none' }}
            />
            <Tab
              icon={<BookIcon />}
              iconPosition='start'
              label={t('bookmarks')}
              value='2'
              sx={{ minHeight: 'auto', textTransform: 'none' }}
            />
            <Tab
              icon={
                <Badge
                  badgeContent={
                    <AccountCircleIcon
                      sx={{
                        marginLeft: -1,
                        marginBottom: 2,
                        backgroundColor: 'white',
                        borderRadius: 5,
                        fontSize: 15,
                      }}
                    />
                  }
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <ViewListIcon />
                </Badge>
              }
              iconPosition='start'
              label={t('myCompilations')}
              value='3'
              sx={{ minHeight: 'auto', textTransform: 'none' }}
            />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Carousel
            articles={history}
            isLoading={isFetchingViewed}
            lang={lang}
          />
          <Box className='link'>
            <Link href={`/${lang}/users/${username}/history`}>
              <ArrowCircleRightOutlinedIcon sx={{ mr: 1 }} />
              {t('historyLink')}
            </Link>
          </Box>
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
