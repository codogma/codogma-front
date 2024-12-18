'use client';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { PopoverElement } from '@/components/PopoverElement';
import { bookmark, unbookmark } from '@/helpers/articleApi';

interface BookmarkProps {
  readonly username?: string;
  readonly id: number;
  readonly isBookmarkedValue?: boolean;
}

export const Bookmark: React.FC<BookmarkProps> = ({
  username,
  id,
  isBookmarkedValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedValue);
  const { state } = useAuth();
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const handleUnbookmark = async () => {
    if (state.isAuthenticated) {
      await unbookmark(id).then((response) =>
        setIsBookmarked(response.isBookmarked),
      );
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
        <PopoverElement destination={'to add an article to your bookmarks'} />
      )}
    </>
  ) : null;
};
