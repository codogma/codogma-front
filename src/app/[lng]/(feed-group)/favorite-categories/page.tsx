'use client';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import Categories from '@/components/Categories';
import { devConsoleError } from '@/helpers/devConsoleLogs';
import { getUserByUsername } from '@/helpers/userApi';
import { Category } from '@/types';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const { state } = useAuth();
  const username = state.user?.username;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUserByUsername(username);
        setCategories(user.favorites);
      } catch (error) {
        devConsoleError('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return <Categories lang={lng} categories={categories} loading={loading} />;
}
