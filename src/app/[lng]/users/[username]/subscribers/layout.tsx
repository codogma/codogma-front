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
      canonical: `/users/${username}/subscribers`,
      languages: {
        en: `/en/users/${username}/subscribers`,
        ru: `/ru/users/${username}/subscribers`,
      },
    },
    title: t('subscribersByUser'),
    description: user.shortInfo,
    keywords: user.categories.map((category) => category.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
