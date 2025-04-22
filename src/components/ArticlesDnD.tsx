import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Close as CloseIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import {
  updateCompilation,
  UpdateCompilationDTO,
} from '@/helpers/compilationApi';
import { GetArticle, GetCompilation, Language } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type ArticlesDnDProps = {
  readonly lang: Language;
  readonly compilationData: GetCompilation;
  readonly onClose: () => void;
  readonly refetch?: () => void;
};

export const ArticlesDnD = ({
  lang,
  compilationData,
  onClose,
  refetch,
}: ArticlesDnDProps) => {
  const { t } = useTranslation(lang, 'articles');
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
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('sortArticles')}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DragDropProvider
            onDragEnd={(event) => {
              setArticles((items) => move(items, event));
            }}
          >
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onSave}>{t('save')}</Button>
        </DialogActions>
      </BootstrapDialog>
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
        <ListItemText primary={article.title} />
      </ListItem>
    </Paper>
  );
};
