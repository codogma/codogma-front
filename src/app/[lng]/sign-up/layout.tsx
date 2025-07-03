'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('signUpPage');
  return {
    alternates: {
      canonical: `/sign-up/`,
      languages: {
        en: `/en/sign-up/`,
        ru: `/ru/sign-up/`,
      },
    },
    title: t('signUp'),
    description: t('signUpDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
