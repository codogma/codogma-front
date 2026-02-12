'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { Categories } from '@/components/Categories';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { WithAuth } from '@/components/WithAuth';
import { contlCookie } from '@/constants/i18n';
import { CATEGORIES_PER_PAGE } from '@/constants/limits';
import { getCategories, GetCategoriesDTO } from '@/helpers/categoryApi';
import { useEventListener } from '@/helpers/useEventListener';
import { GetCategory, Language, SearchType } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: Language }>;
};

function Page({ params }: PageProps) {
  const { lng } = use(params);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<SearchType>(SearchType.INFO);

  const onSearchType = (type: SearchType) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isPending, refetch } = useQuery<GetCategoriesDTO>({
    queryKey: [
      'favorite-categories',
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === SearchType.TAG ? searchValue : undefined;
      const byInfo = searchType === SearchType.INFO ? searchValue : undefined;
      return getCategories(byTag, byInfo, true, currentPage, resultsPerPage);
    },
  });

  const categories: GetCategory[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEventListener(contlCookie, () => refetch());

  useEventListener('api', () => refetch());

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Search onSearchType={onSearchType} onSearchValue={onSearchValue} />
      <Categories
        lang={lng}
        categories={categories}
        isLoading={isPending}
        categoriesPerPageStart={CATEGORIES_PER_PAGE}
      />
      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={CATEGORIES_PER_PAGE}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
}

export default WithAuth(Page);
