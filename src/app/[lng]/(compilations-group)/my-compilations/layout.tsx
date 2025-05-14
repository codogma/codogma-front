'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getT } from '@/app/i18n';
import { SignIn } from '@/components/SignIn';
import { Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: Language };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await getT(lng);
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
    description: t('compilationsDescription'),
  };
}

export default async function Layout({
  children,
  params: { lng },
}: LayoutProps) {
  return <SignIn lang={lng}>{children}</SignIn>;
}
