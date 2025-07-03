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
      canonical: `/users/${username}/profile`,
      languages: {
        en: `/en/users/${username}/profile`,
        ru: `/ru/users/${username}/profile`,
      },
    },
    title: t('profileByUser'),
    description: user.shortInfo,
    keywords: user.categories.map((category) => category.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
