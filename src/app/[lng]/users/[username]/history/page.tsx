'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { Articles } from '@/components/Articles';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { GetArticlesDTO, getViewed } from '@/helpers/articleApi';
import { Language, SearchType } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default function Layout({ params }: PageProps) {
  const { lng } = use(params);
  const lang = lng as Language;
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

  const { data: viewedData, isPending: isPendingViewed } =
    useQuery<GetArticlesDTO>({
      queryKey: [
        'history',
        currentPage,
        resultsPerPage,
        searchType,
        searchValue,
      ],
      queryFn: () => {
        const byTag = searchType === SearchType.TAG ? searchValue : undefined;
        const byContent =
          searchType === SearchType.CONTENT ? searchValue : undefined;
        return getViewed(currentPage, resultsPerPage, byTag, byContent);
      },
    });

  const history = viewedData?.content ?? [];
  const totalPages = viewedData?.totalPages ?? 0;
  const totalElements = viewedData?.totalElements ?? 0;

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
        articles={history}
        isLoading={isPendingViewed}
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
