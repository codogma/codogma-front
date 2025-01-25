import { Close as CloseIcon } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Dialog, Link } from '@mui/material';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { CustomPagination } from '@/components/CustomPagination';
import {
  getNotifications,
  GetNotificationsDTO,
} from '@/helpers/notificationAPI';
import { GetNotification, NotificationType } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type NotificationsDialogProps = {
  readonly lang: string;
};

export const NotificationsDialog = ({ lang }: NotificationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const { t } = useTranslation(lang, 'notifications');
  const router = useRouter();

  const { data } = useQuery<GetNotificationsDTO>({
    queryKey: ['notifications', currentPage, resultsPerPage],
    queryFn: () => {
      return getNotifications(undefined, currentPage, resultsPerPage);
    },
  });

  const notifications: GetNotification[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickArticleModeration = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  return (
    <>
      <Tooltip title={t('notifications')}>
        <IconButton color='inherit' onClick={handleClickOpen}>
          <Badge badgeContent={totalElements} color='primary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
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
          <Box
            noValidate
            component='form'
            autoComplete='off'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              minWidth: 420,
              width: 'fit-content',
              gap: 2,
            }}
          >
            {notifications?.map((notification) => (
              <Card
                key={notification.id}
                variant='outlined'
                sx={{ maxWidth: 760 }}
              >
                <Box sx={{ p: 2 }}>
                  {notification.type === NotificationType.SYSTEM && (
                    <>
                      <Stack
                        direction='row'
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <WarningAmberIcon color='warning' />
                        <Typography gutterBottom variant='h5' component='div'>
                          {notification.title}
                        </Typography>
                        <WarningAmberIcon color='warning' />
                      </Stack>
                      <Typography gutterBottom component='div'>
                        {notification.message}
                      </Typography>
                    </>
                  )}
                  {notification.type ===
                    NotificationType.ARTICLE_MODERATION && (
                    <>
                      <Stack
                        direction='row'
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography gutterBottom variant='h5' component='div'>
                          {notification.title}
                        </Typography>
                      </Stack>
                      <Typography gutterBottom component='div'>
                        {notification.message}
                        <Link
                          onClick={() =>
                            handleClickArticleModeration(
                              `/${lang}/articles/${notification.articleId}`,
                            )
                          }
                        >
                          <br />
                          <Button>Проверить</Button>
                        </Link>
                      </Typography>
                    </>
                  )}
                  {(notification.type === NotificationType.COMMENT_MODERATION ||
                    notification.type === NotificationType.COMMENT_REPLIED) && (
                    <>
                      <Stack
                        direction='row'
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography gutterBottom variant='h5' component='div'>
                          {notification.title}
                        </Typography>
                      </Stack>
                      <Typography gutterBottom component='div'>
                        {notification.message}
                        <Link
                          onClick={() =>
                            handleClickArticleModeration(
                              `/${lang}/articles/${notification.articleId}#comment-${notification.commentId}`,
                            )
                          }
                        >
                          <Button>Проверить</Button>
                        </Link>
                      </Typography>
                    </>
                  )}
                </Box>
              </Card>
            ))}
          </Box>
          <CustomPagination
            lang={lang}
            totalPages={totalPages}
            totalElements={totalElements}
            onCurrentPageChange={onPageChange}
            onResultsPerPageChange={onResultsPerPageChange}
          />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};
