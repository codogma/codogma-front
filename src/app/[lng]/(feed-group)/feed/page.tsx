'use client';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';

import Articles from '@/components/Articles';
import { useAuth } from '@/components/AuthProvider';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

const Page = ({ params: { lng } }: PageProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<'content' | 'tag'>('content');
  const { processContent } = useContentImageContext();
  const { state } = useAuth();
  const username = state.user?.username;

  const onSearchType = (type: 'content' | 'tag') => {
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
      username,
    ],
    queryFn: () => {
      const byTag = searchType === 'tag' ? searchValue : undefined;
      const byContent = searchType === 'content' ? searchValue : undefined;
      return getArticles(
        undefined,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
        undefined,
        username,
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
};

export default Page;
