'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    alternates: {
      canonical: `/feed/`,
      languages: {
        en: `/en/feed/`,
        ru: `/ru/feed/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('feed'),
    },
    description: t('articlesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
