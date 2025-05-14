'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { getUserByUsername } from '@/helpers/userApi';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { username: string; lng: Language };
};

export async function generateMetadata({
  params: { username, lng },
}: LayoutProps): Promise<Metadata> {
  const user = await getUserByUsername(username);
  const { t } = await getT(lng, 'authors');
  return {
    alternates: {
      canonical: `/users/${username}/history`,
      languages: {
        en: `/en/users/${username}/history`,
        ru: `/ru/users/${username}/history`,
      },
    },
    title: t('browsingHistory'),
    description: user.shortInfo,
    keywords: user.categories.map((category) => category.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
