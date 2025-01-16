'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng, 'compilations');
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

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
