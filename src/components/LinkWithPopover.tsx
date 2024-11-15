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
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Article } from '@/types';

type LinkWithPopoverProps = {
  readonly draftArticles: Article[];
  readonly onDeleteArticle: (id: number) => void;
  readonly onSelectArticle: (article: Article) => void;
  readonly lang: string;
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

  const { t } = useTranslation(lang, 'articleEditor');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectArticle = (article: Article) => {
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
        {draftArticles.length} {t('inDrafts')} <ExpandMore />
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
