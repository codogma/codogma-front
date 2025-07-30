import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

type LayoutProps = {
  readonly children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    alternates: {
      canonical: `/articles/`,
      languages: {
        en: `/en/articles/`,
        ru: `/ru/articles/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('articles'),
    },
    description: t('articlesPage.articlesDescription'),
  };
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
