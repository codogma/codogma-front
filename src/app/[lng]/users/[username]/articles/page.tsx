'use client';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';

import { Articles } from '@/components/Articles';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { Language, SearchType } from '@/types';

type PageParams = {
  username: string;
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Layout({ params: { lng, username } }: PageProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
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

  const { data, isPending } = useQuery<GetArticlesDTO>({
    queryKey: [
      'articles',
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
      username,
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
        lang={lng}
        articles={articles}
        loading={isPending}
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
