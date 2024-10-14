'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext } from 'react';

import { Article } from '@/types';

interface ArticleContextType {
  article: Article;
}

const ArticleContext = createContext<ArticleContextType>({
  article: {} as Article,
});

export const useArticle = () => useContext(ArticleContext);

export const ArticleProvider = ({
  children,
  article,
}: {
  children: React.ReactNode;
  article: Article;
}) => {
  const router = useRouter();
  if (!article) {
    router.push('/not-found');
    return null;
  }
  return (
    <ArticleContext.Provider value={{ article }}>
      {children}
    </ArticleContext.Provider>
  );
};
