import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { DefaultImage } from '@/components/DefaultImage';
import {
  updateCompilation,
  UpdateCompilationDTO,
} from '@/helpers/compilationApi';
import { GetArticle, GetCompilation } from '@/types';

import { CustomDialog } from './CustomDialog';

type ArticlesDnDProps = {
  readonly compilationData: GetCompilation;
  readonly onClose: () => void;
  readonly refetch?: () => void;
};

export const ArticlesDnD = ({
  compilationData,
  onClose,
  refetch,
}: ArticlesDnDProps) => {
  const t = useTranslations('articlesPage');
  const [open, setOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<GetArticle[]>([]);

  const handleDeleteArticle = (articleId: number) => {
    setArticles((prev) => prev.filter((article) => article.id !== articleId));
  };

  const handleClickOpen = () => {
    if (onClose) {
      onClose();
    }
    setArticles(compilationData.articles);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { mutate: updateCompilationMutate } = useMutation({
    mutationFn: (requestData: UpdateCompilationDTO) =>
      updateCompilation(compilationData.id, requestData),
    onSuccess: () => {
      if (refetch) {
        refetch();
      }
    },
  });

  const onSave = () => {
    const requestData: UpdateCompilationDTO = {
      articleIds: articles.map((article) => article.id),
    };
    updateCompilationMutate(requestData);
    handleClose();
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen} disableRipple>
        <Typography textAlign='center'>
          <SwapVertIcon />
          {t('sortArticles')}
        </Typography>
      </MenuItem>
      <CustomDialog
        open={open}
        onClose={handleClose}
        dividers
        title={t('sortArticles')}
        actions={<Button onClick={onSave}>{t('save')}</Button>}
      >
        <DragDropProvider
          onDragEnd={(event) => {
            setArticles((items) => move(items, event));
          }}
        >
          <List
            sx={{
              width: '100%',
              maxWidth: 500,
            }}
            className='inline-flex flex-col gap-2'
          >
            {articles.map((article, index) => (
              <SortableItem
                key={article.id}
                article={article}
                index={index}
                onDelete={handleDeleteArticle}
              />
            ))}
          </List>
        </DragDropProvider>
      </CustomDialog>
    </>
  );
};

type SortableItemProp = {
  readonly article: GetArticle;
  readonly index: number;
  readonly onDelete: (articleId: number) => void;
};

const SortableItem = ({ article, index, onDelete }: SortableItemProp) => {
  const { ref, handleRef } = useSortable({
    id: article.id,
    index,
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <Paper ref={ref} elevation={3}>
      <ListItem
        alignItems='center'
        secondaryAction={
          <Tooltip title='Delete'>
            <IconButton
              edge='end'
              aria-label='delete'
              onClick={() => onDelete(article.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemIcon>
          <IconButton
            ref={handleRef}
            sx={{ cursor: 'grab' }}
            id={`item-${index}`}
          >
            <DragIndicatorIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemAvatar
          sx={{
            height: 50,
            aspectRatio: '16/9',
            mr: 2,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <DefaultImage
            src={
              article.image &&
              `${process.env.NEXT_PUBLIC_BASE_URL}${article.image.imageUrl}`
            }
            top={0}
            left={0}
            zIndex={0}
            className='scale-x-100 transition-transform will-change-transform'
          />
        </ListItemAvatar>
        <ListItemText primary={article.title} />
      </ListItem>
    </Paper>
  );
};
