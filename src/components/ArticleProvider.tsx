'use client';
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useMemo } from 'react';

import { TocItem } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

interface ArticleContextType {
  article: GetArticle;
  toc: TocItem[];
}

const ArticleContext = createContext<ArticleContextType>({
  article: {} as GetArticle,
  toc: [] as TocItem[],
});

export const useArticle = () => useContext(ArticleContext);

export const ArticleProvider = ({
  children,
  article,
  toc,
}: {
  readonly children: React.ReactNode;
  readonly article: GetArticle;
  readonly toc: TocItem[];
}) => {
  if (!article) {
    redirect('/not-found');
  }

  const articleValue = useMemo(() => ({ article, toc }), [article, toc]);

  return (
    <ArticleContext.Provider value={articleValue}>
      {children}
    </ArticleContext.Provider>
  );
};
