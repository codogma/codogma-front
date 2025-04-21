'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng);
  return {
    alternates: {
      canonical: `/articles/`,
      languages: {
        en: `/en/articles/`,
        ru: `/ru/articles/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('articles'),
    },
    description: t('articlesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
