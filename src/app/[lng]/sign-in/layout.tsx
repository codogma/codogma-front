'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng, 'signIn');
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
