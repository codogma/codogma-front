'use server';
import React from 'react';

import Article from '@/components/Article';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: Language }>;
};

export default async function Page({ params }: PageProps) {
  const { lng } = await params;
  return <Article lang={lng} />;
}
