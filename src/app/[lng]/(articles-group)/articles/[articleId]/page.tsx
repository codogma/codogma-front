'use server';
import React from 'react';

import { Article } from '@/components/Article';
import { Language } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default async function Page({ params }: PageProps) {
  const { lng } = await params;
  const lang = lng as Language;
  return <Article lang={lang} />;
}
