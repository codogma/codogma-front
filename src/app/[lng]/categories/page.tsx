'use client';
import React, { useEffect, useState } from 'react';

import Categories from '@/components/Categories';
import { getCategories } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLog';
import { Category } from '@/types';

type PageProps = {
  readonly params: {
    lng: string;
  };
};

export default function Page({ params: { lng } }: PageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const allCategories = await getCategories();
        setCategories(allCategories);
      } catch (error) {
        devConsoleError('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return <Categories lang={lng} categories={categories} loading={loading} />;
}
