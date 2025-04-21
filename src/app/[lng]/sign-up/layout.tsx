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
  const { t } = await initTranslation(lng, 'signUp');
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
