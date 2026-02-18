'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';

import { Articles } from '@/components/Articles';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles } from '@/helpers/articleApi';
import { useEventListener } from '@/helpers/useEventListener';
import { ArticleSortField, Language, SearchType, SortOrder } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default function Page({ params }: PageProps) {
  const { lng } = use(params);
  const lang = lng as Language;
  const searchParams = useSearchParams(); // ДОБАВЛЕНО

  // Состояние сортировки из URL
  const [sort, setSort] = useState<ArticleSortField>(
    (searchParams.get('sort') as ArticleSortField) ||
      ArticleSortField.UPDATED_AT,
  );
  const [order, setOrder] = useState<SortOrder>(
    (searchParams.get('order') as SortOrder) || SortOrder.DESC,
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);

  // Синхронизация URL с состоянием
  useEffect(() => {
    const currentSort = searchParams.get('sort') as ArticleSortField;
    const currentOrder = searchParams.get('order') as SortOrder;

    if (currentSort && Object.values(ArticleSortField).includes(currentSort)) {
      setSort(currentSort);
    }
    if (currentOrder && Object.values(SortOrder).includes(currentOrder)) {
      setOrder(currentOrder);
    }
  }, [searchParams]);

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      'articles',
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
      sort,
      order,
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
        undefined,
        undefined,
        sort,
        order,
      );
    },
    placeholderData: keepPreviousData,
  });

  useEventListener(contlCookie, () => refetch());

  // Обработчики поиска (сохранены без изменений)
  const onSearchType = (type: SearchType) => {
    setSearchType(type);
    setCurrentPage(0);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const articles = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <>
      <Search onSearchType={onSearchType} onSearchValue={onSearchValue} />
      <Articles
        lang={lang}
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
