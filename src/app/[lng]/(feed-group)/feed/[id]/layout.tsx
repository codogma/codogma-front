'use server';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { ArticleProvider } from '@/components/ArticleProvider';
import { getArticleById } from '@/helpers/articleApi';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';
import { parseToc } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ id: string; lng: string }>;
};

async function fetchArticleById(id: number): Promise<GetArticle> {
  return await getArticleById(id);
}

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticleById(Number(id));
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

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;
  const article = await fetchArticleById(Number(id));
  const toc = await parseToc(article.content);
  return (
    <ArticleProvider article={article} toc={toc}>
      {children}
    </ArticleProvider>
  );
}
