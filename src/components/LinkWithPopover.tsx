import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import React, { useEffect, useState } from 'react';

import { useT } from '@/app/i18n/client';
import { GetArticle, Language } from '@/types';

type LinkWithPopoverProps = {
  readonly draftArticles: GetArticle[];
  readonly onDeleteArticle: (id: number) => void;
  readonly onSelectArticle: (article: GetArticle) => void;
  readonly lang: Language;
};

export const LinkWithPopover = ({
  draftArticles,
  onDeleteArticle,
  onSelectArticle,
  lang,
}: LinkWithPopoverProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const { t } = useT('articleEditor');
  const [inDrafts, setInDrafts] = useState<string>();

  useEffect(() => {
    const match = draftArticles.length.toString().match(/\d$/);
    if (match) {
      const lastDigit = Number(match[0]);
      if (lang === Language.RU) {
        if (lastDigit === 1) {
          setInDrafts(t('inDrafts'));
        } else if ([2, 3, 4].includes(lastDigit)) {
          setInDrafts(t('inDrafts') + 'а');
        } else {
          setInDrafts(t('inDrafts') + 'ов');
        }
      } else {
        if (lastDigit > 1) {
          setInDrafts(t('inDrafts') + 's');
        } else {
          setInDrafts(t('inDrafts'));
        }
      }
    }
  }, [draftArticles, lang, t]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectArticle = (article: GetArticle) => {
    onSelectArticle(article);
    handleClose();
  };

  const handleDeleteArticle = (id: number) => {
    onDeleteArticle(id);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Link
        component='button'
        aria-describedby={id}
        type='button'
        underline='none'
        onClick={handleClick}
      >
        {draftArticles.length} {inDrafts}
        <ExpandMore />
      </Link>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              {t('titleDrafts')}
            </ListSubheader>
          }
        >
          {draftArticles.map((article) => (
            <ListItem
              key={article.id}
              secondaryAction={
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleSelectArticle(article)}>
                <ListItemText primary={article.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};
