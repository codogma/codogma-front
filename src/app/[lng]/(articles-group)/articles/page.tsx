'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { Articles } from '@/components/Articles';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles } from '@/helpers/articleApi';
import { useEventListener } from '@/helpers/useEventListener';
import { Language, SearchType } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: Language }>;
};

export default function Page({ params }: PageProps) {
  const { lng } = use(params);

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      'articles',
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
        undefined,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
      );
    },
    placeholderData: keepPreviousData,
  });

  useEventListener(contlCookie, () => refetch());

  const articles = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <>
      <Search
        onSearchType={(type) => {
          setSearchType(type);
          setCurrentPage(0);
        }}
        onSearchValue={(value) => {
          setSearchValue(value);
          setCurrentPage(0);
        }}
      />

      <Articles
        lang={lng}
        articles={articles}
        articlesPerPageStart={resultsPerPage}
        isLoading={isPending}
      />

      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={resultsPerPage}
        onCurrentPageChange={(value: number) => setCurrentPage(value)}
        onResultsPerPageChange={(value: number) => {
          setResultsPerPage(value);
          setCurrentPage(0);
        }}
      />
    </>
  );
}
