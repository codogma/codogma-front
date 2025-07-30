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
      canonical: `/categories/`,
      languages: {
        en: `/en/categories/`,
        ru: `/ru/categories/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('categories'),
    },
    description: t('categoriesPage.categoriesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
