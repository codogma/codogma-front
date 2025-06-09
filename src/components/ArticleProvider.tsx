'use client';
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';

import { useNavigationActions } from '@/components/NavigationProvider';
import { TocItem } from '@/helpers/parseToc';
import { GetArticle } from '@/types';

interface ArticleContextType {
  article: GetArticle;
}

const ArticleContext = createContext<ArticleContextType>({
  article: {} as GetArticle,
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

  const { setArticle, setToc } = useNavigationActions();

  useEffect(() => {
    setArticle(article);
    setToc(toc);
    return () => {
      setArticle(undefined);
      setToc([]);
    };
  }, [article, setArticle, setToc, toc]);

  return (
    <ArticleContext.Provider value={{ article }}>
      {children}
    </ArticleContext.Provider>
  );
};
