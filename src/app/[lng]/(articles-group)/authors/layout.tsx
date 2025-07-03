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
    description: t('authorsPage.authorsDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
