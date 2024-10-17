'use server';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { ArticleProvider } from '@/components/ArticleProvider';
import { BreadcrumbsComponent } from '@/components/BreadcrumbsComponent';
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

export default async function Layout({
  children,
  params: { id, lng },
}: LayoutProps) {
  const article = await fetchArticleById(id);
  return (
    <ArticleProvider article={article}>
      <BreadcrumbsComponent title={article.title} lang={lng} depth={3} />
      {children}
    </ArticleProvider>
  );
}
