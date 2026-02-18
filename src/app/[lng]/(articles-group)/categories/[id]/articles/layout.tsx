'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { getCategoryById } from '@/helpers/categoryApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(Number(id));
  const t = await getTranslations('categoriesPage');
  return {
    alternates: {
      canonical: `/categories/${id}/articles`,
      languages: {
        en: `/en/categories/${id}/articles`,
        ru: `/ru/categories/${id}/articles`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('articlesInCategory') + ' ' + category.name,
    },
    description: category.description,
    keywords: category.tags.map((tag) => tag.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
