'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('authors');
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
