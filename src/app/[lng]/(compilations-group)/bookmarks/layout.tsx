'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { SignIn } from '@/components/SignIn';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng, 'compilations');
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
