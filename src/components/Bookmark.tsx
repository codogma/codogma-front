'use client';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { bookmark, unbookmark } from '@/helpers/compilationApi';

interface BookmarkProps {
  readonly username?: string;
  readonly lang: string;
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'articles');
  const popoverId = 'simple-popover';

  const handleUnbookmark = () => {
    if (state.isAuthenticated) {
      unbookmark(id).then((response) => {
        if (refetch) {
          refetch();
        }
        setIsBookmarked(response.isBookmarked);
      });
    }
  };

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (state.isAuthenticated) {
      await bookmark(id).then((response) =>
        setIsBookmarked(response.isBookmarked),
      );
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return state.user?.username !== username ? (
    <>
      {isBookmarked ? (
        <IconButton onClick={handleUnbookmark}>
          <BookmarkIcon color='error' />
        </IconButton>
      ) : (
        <IconButton onClick={handleBookmark}>
          <BookmarkIcon aria-describedby={popoverId} />
        </IconButton>
      )}
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
