'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { SignIn } from '@/components/SignIn';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('compilations');
  return {
    alternates: {
      canonical: `/bookmarks`,
      languages: {
        en: `/en/bookmarks`,
        ru: `/ru/bookmarks`,
      },
    },
    title: t('bookmarksByUser'),
    description: t('bookmarksByUser'),
  };
}

export default async function Layout({
  children,
  params: { lng },
}: LayoutProps) {
  return <SignIn lang={lng}>{children}</SignIn>;
}
