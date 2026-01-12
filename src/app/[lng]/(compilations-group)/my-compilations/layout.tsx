'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { SignIn } from '@/components/SignIn';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ lng: Language }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    alternates: {
      canonical: `/compilations/`,
      languages: {
        en: `/en/compilations/`,
        ru: `/ru/compilations/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('compilations'),
    },
    description: t('compilationsPage.compilationsDescription'),
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params;
  return <SignIn lang={lng}>{children}</SignIn>;
}
