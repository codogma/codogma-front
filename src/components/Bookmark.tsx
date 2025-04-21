'use client';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { bookmark, unbookmark } from '@/helpers/compilationApi';
import { Language } from '@/types';

interface BookmarkProps {
  readonly username?: string;
  readonly lang: Language;
  readonly id: number;
  readonly isBookmarkedValue?: boolean;
  readonly refetch?: () => void;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  username,
  id,
  lang,
  isBookmarkedValue,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'articles');
  const popoverId = 'simple-popover';

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (state.isAuthenticated) {
      setIsBookmarked(checked);

      if (checked) {
        await bookmark(id).then(() => refetch && refetch());
      } else {
        await unbookmark(id).then(() => refetch && refetch());
      }
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== username ? (
    <>
      <Checkbox
        checked={isBookmarked}
        onChange={handleChange}
        icon={<BookmarkIcon aria-describedby={popoverId} />}
        checkedIcon={<BookmarkIcon color='error' />}
        inputProps={{ 'aria-label': 'Bookmark compilation' }}
      />
      {!state.isAuthenticated && (
        <PopoverElement
          popoverId={popoverId}
          btnEl={anchorEl}
          onClose={handlePopoverClose}
          destination={t('popoverBookmark')}
          lang={lang}
        />
      )}
    </>
  ) : null;
};
