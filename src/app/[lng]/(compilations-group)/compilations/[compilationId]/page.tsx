'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useEffect, useState } from 'react';

import { Articles } from '@/components/Articles';
import { useCompilation } from '@/components/CompilationProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language, SearchType } from '@/types';

type PageProps = {
  readonly params: Promise<{ compilationId: string; lng: string }>;
};

export default function Page({ params }: PageProps) {
  const { compilationId, lng } = use(params);
  const lang = lng as Language;
  const compilationIdNum = Number(compilationId);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');
  const { isRefetch, resetRefetch } = useCompilation();

  const onSearchType = (type: string) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isPending, refetch } = useQuery<GetArticlesDTO>({
    queryKey: [
      'articles',
      compilationIdNum,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === SearchType.TAG ? searchValue : undefined;
      const byContent =
        searchType === SearchType.CONTENT ? searchValue : undefined;
      return getArticles(
        undefined,
        compilationIdNum,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
      );
    },
  });

  const articles = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEffect(() => {
    if (isRefetch) {
      refetch().then(() => resetRefetch());
    }
  }, [isRefetch, refetch, resetRefetch]);

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
        lang={lang}
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
