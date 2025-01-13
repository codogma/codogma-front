'use client';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';

import Articles from '@/components/Articles';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { SearchType } from '@/types';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<string>('content');
  const { processContent } = useContentImageContext();

  const onSearchType = (type: string) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isFetching, refetch } = useQuery<GetArticlesDTO>({
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
  });

  const content = data?.content ?? [];
  const articles = content.map((article) => ({
    ...article,
    previewContentNode: processContent(
      DOMPurify.sanitize(article.previewContent),
    ),
  }));
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
      <Articles lang={lng} articles={articles} loading={isFetching} />
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
