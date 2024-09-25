'use client';
import React, { createContext, useContext } from 'react';
import { Article } from '@/types';
import { useRouter } from 'next/navigation';

interface ArticleProvider {
  article: Article;
}

const ArticleContext = createContext<ArticleProvider>({
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
