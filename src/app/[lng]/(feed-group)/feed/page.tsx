'use client';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';

import { Articles } from '@/components/Articles';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import { contlCookie } from '@/constants/i18n';
import { ARTICLES_PER_PAGE } from '@/constants/limits';
import { getArticles, GetArticlesDTO } from '@/helpers/articleApi';
import { useEventListener } from '@/helpers/useEventListener';
import { Language, SearchType } from '@/types';

type PageProps = {
  readonly params: {
    lng: Language;
  };
};

const Page = ({ params: { lng } }: PageProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] =
    useState<number>(ARTICLES_PER_PAGE);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CONTENT);
  const { processContent } = useContentImageContext();

  const onSearchType = (type: SearchType) => {
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
      const isFeed = true;
      return getArticles(
        undefined,
        undefined,
        currentPage,
        resultsPerPage,
        byTag,
        byContent,
        undefined,
        isFeed,
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

  useEventListener(contlCookie, () => refetch());

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
        loading={isFetching}
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
};

export default Page;
