'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { getUserByUsername } from '@/helpers/userApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { username: string };
};

export async function generateMetadata({
  params: { username },
}: LayoutProps): Promise<Metadata> {
  const user = await getUserByUsername(username);
  const t = await getTranslations('authorsPage');
  return {
    alternates: {
      canonical: `/users/${username}/comments`,
      languages: {
        en: `/en/users/${username}/comments`,
        ru: `/ru/users/${username}/comments`,
      },
    },
    title: t('commentsByUser'),
    description: user.shortInfo,
    keywords: user.categories.map((category) => category.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
