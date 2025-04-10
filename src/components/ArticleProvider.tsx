'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext } from 'react';

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
