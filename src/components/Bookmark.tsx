'use client';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { BookmarkCard } from '@/components/BookmarkCard';
import { Language } from '@/types';

type BookmarkProps = {
  readonly lang: Language;
  readonly id: number;
  readonly isBookmarkedValue: boolean;
  readonly refetch?: () => void;
};

export const Bookmark = (
  lang,
  id,
  isBookmarkedValue,
  refetch,
): BookmarkProps => {
  const { t } = useTranslation(lang);

  return (
    <BookmarkCard
      lang={lang}
      id={id}
      isBookmarkedValue={true}
      refetch={refetch}
    />
  );
};
