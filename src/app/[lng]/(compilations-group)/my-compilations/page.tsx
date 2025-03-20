'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import Compilations from '@/components/Compilations';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { getCompilations, GetCompilationsDTO } from '@/helpers/compilationApi';
import { useEventListener } from '@/helpers/useEventListener';
import { GetCompilation, Language, SearchType } from '@/types';

type PageProps = {
  readonly params: {
    lng: Language;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);
  const { state } = useAuth();
  const username: string | undefined = state.user?.username;

  const onSearchType = (type: SearchType) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isFetching, refetch } = useQuery<GetCompilationsDTO>({
    queryKey: [
      'compilations',
      username,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === SearchType.TAG ? searchValue : undefined;
      const byContent =
        searchType === SearchType.CONTENT ? searchValue : undefined;
      return getCompilations(
        byTag,
        byContent,
        username,
        false,
        currentPage,
        resultsPerPage,
      );
    },
  });

  const compilations: GetCompilation[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEventListener(contlCookie, () => refetch());

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Search
        lang={lng}
        onSearchType={onSearchType}
        onSearchValue={onSearchValue}
      />
      <Compilations
        lang={lng}
        loading={isFetching}
        compilations={compilations}
      />
      <CustomPagination
        lang={lng}
        totalPages={totalPages}
        totalElements={totalElements}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}
