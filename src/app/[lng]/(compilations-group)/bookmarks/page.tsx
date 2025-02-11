'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

import Compilations from '@/components/Compilations';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { getCompilations, GetCompilationsDTO } from '@/helpers/compilationApi';
import { GetCompilation, Language, SearchType } from '@/types';

type PageProps = {
  readonly params: {
    lng: Language;
  };
};

const Page = ({ params: { lng } }: PageProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);

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
        undefined,
        true,
        currentPage,
        resultsPerPage,
      );
    },
  });

  const compilations: GetCompilation[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEffect(() => {
    window.addEventListener(contlCookie, () => refetch());
    if (window.location.hash === '#search-input' && searchInputRef.current) {
      searchInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      searchInputRef.current.focus();
    }
  }, [refetch]);

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
      <Compilations
        lang={lng}
        loading={isFetching}
        compilations={compilations}
        refetch={refetch}
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
};

export default Page;
