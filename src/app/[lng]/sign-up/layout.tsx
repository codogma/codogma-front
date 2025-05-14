'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('signUp');
  return {
    alternates: {
      canonical: `/sign-up/`,
      languages: {
        en: `/en/sign-up/`,
        ru: `/ru/sign-up/`,
      },
    },
    title: t('signUp'),
    description: t('signUpDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
