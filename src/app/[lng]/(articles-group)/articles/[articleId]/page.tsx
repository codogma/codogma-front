'use server';
import React from 'react';

import Article from '@/components/Article';
import { Language } from '@/types';

type PageParams = {
  readonly lng: Language;
};

type PageProps = {
  readonly params: PageParams;
};

export default async function Page({ params: { lng } }: PageProps) {
  return <Article lang={lng} />;
}
