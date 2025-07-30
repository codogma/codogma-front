'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('authorsPage');
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
