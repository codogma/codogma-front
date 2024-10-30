'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { getUserByUsername } from '@/helpers/userApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { username: string; lng: string };
};

export async function generateMetadata({
  params: { username, lng },
}: LayoutProps): Promise<Metadata> {
  const user = await getUserByUsername(username, lng);
  const { t } = await initTranslation(lng, 'users');
  return {
    alternates: {
      canonical: `/users/${username}/articles`,
      languages: {
        en: `/en/users/${username}/articles`,
        ru: `/ru/users/${username}/articles`,
      },
    },
    title: t('articlesByUser'),
    description: user.shortInfo,
    keywords: user.categories.map((category) => category.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
