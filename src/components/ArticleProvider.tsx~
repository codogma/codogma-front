'use client';
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';

import { useNavigationActions } from '@/components/NavigationProvider';
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
}: {
  readonly children: React.ReactNode;
  readonly article: GetArticle;
}) => {
  if (!article) {
    redirect('/not-found');
  }

  const { setArticle } = useNavigationActions();

  useEffect(() => {
    setArticle(article);
    return () => setArticle(undefined);
  }, [article, setArticle]);

  return (
    <ArticleContext.Provider value={{ article }}>
      {children}
    </ArticleContext.Provider>
  );
};
