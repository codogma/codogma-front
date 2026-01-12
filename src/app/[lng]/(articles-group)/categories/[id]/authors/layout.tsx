'use server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { getCategoryById } from '@/helpers/categoryApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ id: number }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);
  const t = await getTranslations('categoriesPage');
  return {
    alternates: {
      canonical: `/categories/${id}/authors`,
      languages: {
        en: `/en/categories/${id}/authors`,
        ru: `/ru/categories/${id}/authors`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('authorsInCategory') + ' ' + category.name,
    },
    description: category.description,
    keywords: category.tags.map((tag) => tag.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
