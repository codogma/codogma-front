'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { Articles } from '@/components/Articles';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ id: number; lng: Language }>;
};

export default function Layout({ params }: PageProps) {
  const { id, lng } = use(params);
  const categoryId = id;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');

  const onSearchType = (type: string) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isPending } = useQuery<GetArticlesDTO>({
    queryKey: [
      'articles',
      categoryId,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === 'tag' ? searchValue : undefined;
      const byContent = searchType === 'content' ? searchValue : undefined;
      return getArticles(
        categoryId,
        undefined,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
      );
    },
  });

  const articles = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  return (
    <>
      <Search onSearchType={onSearchType} onSearchValue={onSearchValue} />
      <Articles
        lang={lng}
        articles={articles}
        isLoading={isPending}
        articlesPerPageStart={ARTICLES_PER_PAGE}
      />
      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={ARTICLES_PER_PAGE}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}
