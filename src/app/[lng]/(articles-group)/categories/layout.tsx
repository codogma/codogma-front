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
    description: t('categoriesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
