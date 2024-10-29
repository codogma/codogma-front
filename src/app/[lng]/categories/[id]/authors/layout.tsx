'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getCategoryById } from '@/helpers/categoryApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { id: number; lng: string };
};

export async function generateMetadata({
  params: { id, lng },
}: LayoutProps): Promise<Metadata> {
  const category = await getCategoryById(id, lng);
  return {
    alternates: {
      canonical: `/categories/${id}`,
      languages: {
        en: `/en/categories/${id}`,
        ru: `/ru/categories/${id}`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: `Authors in category ${category.name}`,
    },
    description: category.description,
    keywords: category.tags.map((tag) => tag.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
