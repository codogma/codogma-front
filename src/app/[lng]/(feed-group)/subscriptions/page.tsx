'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';

import { CustomPagination } from '@/components/CustomPagination';
import { Search } from '@/components/Search';
import Users from '@/components/Users';
import { contlCookie } from '@/constants/i18n';
import { getUsers, GetUsersDTO } from '@/helpers/userApi';
import { Language, SearchType, User, UserRole } from '@/types';

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
  const [searchType, setSearchType] = useState<SearchType>(SearchType.INFO);

  const onSearchType = (type: SearchType) => {
    setSearchType(type);
  };

  const onSearchValue = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const { data, isFetching, refetch } = useQuery<GetUsersDTO>({
    queryKey: ['authors', currentPage, resultsPerPage, searchType, searchValue],
    queryFn: () => {
      const byTag = searchType === SearchType.TAG ? searchValue : undefined;
      const byInfo = searchType === SearchType.INFO ? searchValue : undefined;
      return getUsers(
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

  const users: User[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  useEffect(() => {
    window.addEventListener(contlCookie, () => refetch());
    window.addEventListener('api', () => refetch());
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
      <Users lang={lng} users={users} loading={isFetching} />
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
