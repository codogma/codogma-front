'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
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
    description: t('articlesPage.articlesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
