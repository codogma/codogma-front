'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import Users from '@/components/Users';
import { contlCookie } from '@/constants/i18n';
import { USERS_PER_PAGE } from '@/constants/limits';
import { useEventListener } from '@/helpers/useEventListener';
import { getUsers, GetUsersDTO } from '@/helpers/userApi';
import { GetUserDTO, Language, SearchType } from '@/types';

type PageProps = {
  readonly params: Promise<{ username: string; lng: Language }>;
};

const Page = ({ params }: PageProps) => {
  const { username, lng } = use(params);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(USERS_PER_PAGE);
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
      <Search onSearchType={onSearchType} onSearchValue={onSearchValue} />
      <Users
        lang={lng}
        users={subscribers}
        isLoading={isFetching}
        usersPerPageStart={USERS_PER_PAGE}
      />
      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        resultsPerPageStart={USERS_PER_PAGE}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
      />
    </>
  );
};

export default Page;
