'use server';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { ArticleProvider } from '@/components/ArticleProvider';
import { getArticleById } from '@/helpers/articleApi';
import { convertHtmlToText } from '@/helpers/convertHtmlToText';
import { parseToc } from '@/helpers/parseToc';
import { GetArticle, Language } from '@/types';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { compilationId: number; articleId: number; lng: Language };
};

async function fetchArticleById(articleId: number): Promise<GetArticle> {
  return await getArticleById(articleId);
}

export async function generateMetadata(
  { params: { compilationId, articleId } }: LayoutProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const article = await fetchArticleById(articleId);
  const metadataBase = (await parent).metadataBase;
  return {
    alternates: {
      canonical: `/compilations/${compilationId}/${articleId}`,
      languages: {
        en: `/en/compilations/${compilationId}/${articleId}`,
        ru: `/ru/compilations/${compilationId}/${articleId}`,
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
  const toc = await parseToc(article.content);
  return (
    <ArticleProvider article={article} toc={toc}>
      {children}
    </ArticleProvider>
  );
}
