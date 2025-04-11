'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import Articles from '@/components/Articles';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language, SearchType } from '@/types';

type PageParams = {
  id: number;
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Layout({ params: { id, lng } }: PageProps) {
  const compilationId = id;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(12);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');
  const { t } = useTranslation(lng, 'compilations');

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
      <Search
        lang={lng}
        onSearchType={onSearchType}
        onSearchValue={onSearchValue}
      />
      <Articles lang={lng} articles={articles} loading={isPending} />
      <CustomPagination
        lang={lng}
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={resultsPerPage}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}
