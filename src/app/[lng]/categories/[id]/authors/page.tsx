'use client';
import React, { useEffect, useState } from 'react';

import Users from '@/components/Users';
import { devConsoleError, devConsoleInfo } from '@/helpers/devConsoleLogs';
import { getAuthors } from '@/helpers/userApi';
import { User } from '@/types';

type PageParams = {
  id: number;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params }: PageProps) {
  const categoryId = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = await getAuthors(categoryId);
        devConsoleInfo(allUsers);
        setUsers(allUsers);
      } catch (error) {
        devConsoleError('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

  return <Users users={users} loading={loading} />;
}
