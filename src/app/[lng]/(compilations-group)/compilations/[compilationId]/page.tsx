'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import Articles from '@/components/Articles';
import { useCompilation } from '@/components/CompilationProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language, SearchType } from '@/types';

type PageParams = {
  compilationId: number;
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { compilationId, lng } }: PageProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(12);
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
      compilationId,
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
        compilationId,
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
      <Articles lang={lng} articles={articles} loading={isPending} />
      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={resultsPerPage}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}
