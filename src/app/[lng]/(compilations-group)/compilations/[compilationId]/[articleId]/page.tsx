'use client';
import React, { use } from 'react';

import Article from '@/components/Article';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: Language }>;
};

export default function Page({ params }: PageProps) {
  const { lng } = use(params);
  return <Article lang={lng} />;
}
