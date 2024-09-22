'use client';
import React, { useEffect, useState } from 'react';
import { User } from '@/types';
import { getAuthors } from '@/helpers/userApi';
import Authors from '@/components/Authors';
import { devConsole } from '@/helpers/devConsole';

function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allUsers = await getAuthors();
        devConsole(allUsers);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Authors users={users} loading={loading} />
    </>
  );
}

export default Page;
