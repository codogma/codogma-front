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
      canonical: `/authors/`,
      languages: {
        en: `/en/authors/`,
        ru: `/ru/authors/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('authors'),
    },
    description: t('authorsDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
