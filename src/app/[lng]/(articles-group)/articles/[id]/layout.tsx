'use server';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { ArticleProvider } from '@/components/ArticleProvider';
import { getArticleById } from '@/helpers/articleApi';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';
import { Article } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { id: number; lng: string };
};

async function fetchArticleById(id: number): Promise<Article> {
  return await getArticleById(id);
}

export async function generateMetadata(
  { params: { id } }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const article = await fetchArticleById(id);
  const metadataBase = (await parent).metadataBase;
  return {
    alternates: {
      canonical: `/articles/${id}`,
      languages: {
        en: `/en/articles/${id}`,
        ru: `/ru/articles/${id}`,
      },
    },
    title: article.title,
    description: convertHtmlToText(article.previewContent),
    keywords: article.tags.map((tag) => tag.name),
    authors: [
      {
        name: article.username,
        url: `${metadataBase}users/${article.username}`,
      },
    ],
  };
}

export default async function Layout({
  children,
  params: { id },
}: LayoutProps) {
  const article = await fetchArticleById(id);
  return <ArticleProvider article={article}>{children}</ArticleProvider>;
}
