'use server';
import { ReactNode } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getArticleById } from '@/helpers/articleApi';
import { Article } from '@/types';
import { ArticleProvider } from '@/components/ArticleProvider';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';

type LayoutProps = {
  children: ReactNode;
  params: { id: number };
};

async function fetchArticleById(id: number): Promise<Article> {
  return await getArticleById(id);
}

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const articleId = params.id;
  const article = await fetchArticleById(articleId);
  const metadataBase = (await parent).metadataBase;
  return {
    alternates: {
      canonical: `/articles/${articleId}`,
      languages: {
        en: `/en/articles/${articleId}`,
        ru: `/ru/articles/${articleId}`,
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
  const articleId = params.id;
  const article = await fetchArticleById(articleId);
  return <ArticleProvider article={article}>{children}</ArticleProvider>;
}
