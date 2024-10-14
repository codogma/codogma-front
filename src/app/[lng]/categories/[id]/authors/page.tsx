'use client';
import React, { useEffect, useState } from 'react';

import Users from '@/components/Users';
import { devConsoleError, devConsoleLog } from '@/helpers/devConsoleLog';
import { getAuthors } from '@/helpers/userApi';
import { User } from '@/types';

type PageParams = {
  id: number;
};

type PageProps = {
  params: PageParams;
};

function Page({ params }: PageProps) {
  const categoryId = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = await getAuthors(categoryId);
        devConsoleLog(allUsers);
        setUsers(allUsers);
        setIsAuthor(true);
      } catch (error) {
        devConsoleError('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

  return (
    <>
      <Users users={users} loading={loading} isAuthor={isAuthor} />
    </>
  );
}

export default Page;
