'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('signInPage');
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
