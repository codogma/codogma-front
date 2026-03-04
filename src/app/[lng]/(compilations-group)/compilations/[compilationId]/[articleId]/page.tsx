'use client';
import React, { use } from 'react';

import { Article } from '@/components/Article';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default function Page({ params }: PageProps) {
  const { lng } = use(params);
  const lang = lng as Language;
  return <Article lang={lang} />;
}
