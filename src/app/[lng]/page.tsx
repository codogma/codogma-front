import Typography from '@mui/material/Typography';
import NavTabs, { TabProps } from '@/components/NavTabs';
import React from 'react';
import Banner from '@/components/Banner';
import Carousel from '@/components/Carousel';
import { useTranslation } from '@/app/i18n';

type PageProps = {
  params: { lng: string };
};

export default async function Page({ params: { lng } }: PageProps) {
  const tabs: TabProps[] = [
    { label: 'History', href: `/` },
    { label: 'Bookmarks', href: `/` },
    { label: 'Subscriptions', href: `/` },
  ];

  const { t } = await useTranslation(lng, 'main');

  return (
    <section>
      <Banner
        bannerData={{ welcome: t('welcome'), subWelcome: t('subWelcome') }}
      />
      <section className='your-interest'>
        <Typography variant='h3' className='your-interest-h3'>
          Your interest
        </Typography>
        <NavTabs tabs={tabs} />
      </section>
      <Carousel />
      {/*<Carousel/>*/}
      {/*<Carousel/>*/}
      {/*<section className="carousels-section">*/}
      {/*    <section className="recommended">*/}
      {/*        <Typography variant="h3">Recommended for you</Typography>*/}
      {/*    </section>*/}
      {/*    <section className="popular">*/}
      {/*        <Typography variant="h3">Most popular</Typography>*/}
      {/*    </section>*/}
      {/*</section>*/}
    </section>
  );
}
