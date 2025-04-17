'use server';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { ArticleProvider } from '@/components/ArticleProvider';
import { getArticleById } from '@/helpers/articleApi';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';
import { GetArticle } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { id: number; lng: string; articleId: number };
};

async function fetchArticleById(id: number): Promise<GetArticle> {
  return await getArticleById(id);
}

export async function generateMetadata(
  { params: { id, articleId } }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const article = await fetchArticleById(articleId);
  const metadataBase = (await parent).metadataBase;
  return {
    alternates: {
      canonical: `/compilations/${id}/${articleId}`,
      languages: {
        en: `/en/compilations/${id}/${articleId}`,
        ru: `/ru/compilations/${id}/${articleId}`,
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
  params: { articleId },
}: LayoutProps) {
  const article = await fetchArticleById(articleId);
  return <ArticleProvider article={article}>{children}</ArticleProvider>;
}
