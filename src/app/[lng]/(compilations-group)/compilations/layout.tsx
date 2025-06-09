'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('compilations');
  return {
    alternates: {
      canonical: `/compilations/`,
      languages: {
        en: `/en/compilations/`,
        ru: `/ru/compilations/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('compilations'),
    },
    description: t('compilationsDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
