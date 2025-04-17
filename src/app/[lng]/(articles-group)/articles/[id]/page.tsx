'use client';
import React from 'react';

import Article from '@/components/Article';
import { Language } from '@/types';

type PageParams = {
  readonly lng: Language;
  readonly id: number;
};

type PageProps = {
  readonly params: PageParams;
};

export default function Page({ params: { lng, id } }: PageProps) {
  return <Article lng={lng} id={id} />;
}
