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
import * as React from 'react';

import { Article } from '@/types';

type LinkWithPopoverProps = {
  readonly draftArticles: Article[];
  readonly onDeleteArticle: (id: number) => void;
  readonly onSelectArticle: (article: Article) => void;
};

export const LinkWithPopover = ({
  draftArticles,
  onDeleteArticle,
  onSelectArticle,
}: LinkWithPopoverProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

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
        variant='contained'
        onClick={handleClick}
      >
        {draftArticles.length} drafts <ExpandMore />
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
              В черновиках:
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
