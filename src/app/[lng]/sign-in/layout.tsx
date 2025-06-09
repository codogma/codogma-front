'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('signIn');
  return {
    alternates: {
      canonical: `/sign-in/`,
      languages: {
        en: `/en/sign-in/`,
        ru: `/ru/sign-in/`,
      },
    },
    title: t('signIn'),
    description: t('signInDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
