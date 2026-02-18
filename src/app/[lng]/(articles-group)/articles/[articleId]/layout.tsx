'use server';
import { Metadata, ResolvingMetadata } from 'next';
import React, { ReactNode } from 'react';

import { ApplyArticleSettings } from '@/components/ApplyArticleSettings';
import { ArticleProvider } from '@/components/ArticleProvider';
import { getArticleById } from '@/helpers/articleApi';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';
import { parseToc } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{ articleId: string }>;
};

async function fetchArticleById(id: number): Promise<GetArticle> {
  return await getArticleById(id);
}

export async function generateMetadata(
  { params }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { articleId } = await params;
  const article = await fetchArticleById(Number(articleId));
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
    keywords: article.tags?.map((tag) => tag.name),
    authors: [
      {
        name: article.username,
        url: `${metadataBase}users/${article.username}`,
      },
    ],
  };
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const { articleId } = params;

  const { children } = props;

  const article = await fetchArticleById(Number(articleId));
  const toc = await parseToc(article.content);
  return (
    <ArticleProvider article={article} toc={toc}>
      <ApplyArticleSettings />
      {children}
    </ArticleProvider>
  );
}
