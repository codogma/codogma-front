'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { getUserByUsername } from '@/helpers/userApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { username: string };
};

export async function generateMetadata({
  params: { username },
}: LayoutProps): Promise<Metadata> {
  const user = await getUserByUsername(username);
  const { t } = await getT('authors');
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
