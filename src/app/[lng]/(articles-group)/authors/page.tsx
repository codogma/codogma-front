'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import Users from '@/components/Users';
import { getAuthors } from '@/helpers/userApi';
import { User } from '@/types';

export default function Page() {
  const { data, isFetching } = useQuery<User[]>({
    queryKey: ['authors'],
    queryFn: () => getAuthors(),
  });

  const users = data ?? [];

  return <Users users={users} loading={isFetching} />;
}
