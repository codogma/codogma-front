'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng, 'authors');
  return {
    alternates: {
      canonical: `/subscriptions`,
      languages: {
        en: `/en/subscriptions`,
        ru: `/ru/subscriptions`,
      },
    },
    title: t('subscriptionsByUser'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
