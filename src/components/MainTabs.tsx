'use client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import Articles from '@/components/Articles';
import Compilations from '@/components/Compilations';
import { GetArticlesDTO, getViewed } from '@/helpers/articleApi';
import { getCompilations, GetCompilationsDTO } from '@/helpers/compilationApi';
import { Language } from '@/types';

export interface TabProps {
  label: string;
  href: string;
}

// const tabs: TabProps[] = [
//   { label: 'History', href: `/` },
//   { label: 'Bookmarks', href: `/` },
//   { label: 'Subscriptions', href: `/` },
// ];

type MainTabsProps = {
  readonly lang: Language;
};

export const MainTabs: React.FC<MainTabsProps> = ({ lang }) => {
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

  const { data, isFetching: isFetchingBookmarks } =
    useQuery<GetCompilationsDTO>({
      queryKey: ['compilations'],
      queryFn: () => {
        return getCompilations(undefined, undefined, undefined, true, 0, 5);
      },
    });

  const bookmarks = data?.content ?? [];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className='nav-tabs'>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='tabs'>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            <Tab label={t('history')} value='1' />
            <Tab label={t('bookmarks')} value='2' />
            <Tab label={t('myCompilations')} value='3' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Articles lang={lang} articles={history} loading={isFetchingViewed} />
        </TabPanel>
        <TabPanel value='2'>
          <Compilations
            compilations={bookmarks}
            loading={isFetchingBookmarks}
            lang={lang}
          />
        </TabPanel>
        <TabPanel value='3'>Item Three</TabPanel>
      </TabContext>
    </Box>
  );
};
