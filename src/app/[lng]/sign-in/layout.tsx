'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await getT(lng, 'signIn');
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
