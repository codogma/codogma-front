'use client';
import React, { useEffect, useState } from 'react';

import Users from '@/components/Users';
import { devConsoleError, devConsoleLog } from '@/helpers/devConsoleLog';
import { getAuthors } from '@/helpers/userApi';
import { User } from '@/types';

function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = await getAuthors();
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
  }, []);

  return (
    <>
      <Users users={users} loading={loading} isAuthor={isAuthor} />
    </>
  );
}

export default Page;
