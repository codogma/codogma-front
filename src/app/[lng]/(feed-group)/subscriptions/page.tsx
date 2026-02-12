'use client';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';

import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import Users from '@/components/Users';
import { WithAuth } from '@/components/WithAuth';
import { contlCookie } from '@/constants/i18n';
import { USERS_PER_PAGE } from '@/constants/limits';
import { useEventListener } from '@/helpers/useEventListener';
import { getUsers, GetUsersDTO } from '@/helpers/userApi';
import { GetUserDTO, Language, SearchType, UserRole } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: Language }>;
};

const Page = ({ params }: PageProps) => {
  const { lng } = use(params);
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
      'subscriptions',
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
        undefined,
        UserRole.ROLE_AUTHOR,
        byTag,
        byInfo,
        true,
        false,
        currentPage,
        resultsPerPage,
      );
    },
  });

  const users: GetUserDTO[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEventListener(contlCookie, () => refetch());

  useEventListener('api', () => refetch());

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
        users={users}
        isLoading={isFetching}
        usersPerPageStart={USERS_PER_PAGE}
      />
      <CustomPagination
        totalPages={totalPages}
        totalElements={totalElements}
        onCurrentPageChange={onPageChange}
        onResultsPerPageChange={onResultsPerPageChange}
        resultsPerPageStart={USERS_PER_PAGE}
      />
    </>
  );
};

export default WithAuth(Page);
