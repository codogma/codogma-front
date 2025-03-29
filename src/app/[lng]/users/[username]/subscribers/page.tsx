'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import Users from '@/components/Users';
import { contlCookie } from '@/constants/i18n';
import { useEventListener } from '@/helpers/useEventListener';
import { getUsers, GetUsersDTO } from '@/helpers/userApi';
import { GetUserDTO, Language, SearchType } from '@/types';

type PageParams = {
  username: string;
  lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

const Page = ({ params: { username, lng } }: PageProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(12);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchType, setSearchType] = useState<SearchType>(SearchType.INFO);

  const onSearchType = (type: SearchType) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isFetching, refetch } = useQuery<GetUsersDTO>({
    queryKey: [
      'authors',
      username,
      currentPage,
      resultsPerPage,
      searchType,
      searchValue,
    ],
    queryFn: () => {
      const byTag = searchType === SearchType.TAG ? searchValue : undefined;
      const byInfo = searchType === SearchType.INFO ? searchValue : undefined;
      return getUsers(
        undefined,
        username,
        undefined,
        byTag,
        byInfo,
        false,
        true,
        currentPage,
        resultsPerPage,
      );
    },
  });

  const subscribers: GetUserDTO[] = data?.content ?? [];
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
      <Search
        lang={lng}
        onSearchType={onSearchType}
        onSearchValue={onSearchValue}
      />
      <Users lang={lng} users={subscribers} loading={isFetching} />
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
};

export default Page;
