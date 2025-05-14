'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await getT(lng);
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
