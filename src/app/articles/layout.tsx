'use server';
import { ReactNode } from 'react';
import { Metadata } from 'next';

type LayoutProps = {
  children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
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
      default: 'Articles',
    },
    description: `Articles of CODOGMA`,
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
