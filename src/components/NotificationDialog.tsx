import { Close as CloseIcon } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Link,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Fragment, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { CustomPagination } from '@/components/CustomPagination';
import { EditNotification } from '@/components/EditNotification';
import {
  deleteAllSystemNotifications,
  deleteNotification,
  deleteReadNotifications,
  deleteSystemNotification,
  getNotifications,
  GetNotificationsDTO,
  readAllNotifications,
  readNotification,
} from '@/helpers/notificationAPI';
import { GetNotification, Language, NotificationType, UserRole } from '@/types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BadgeDialog = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    position: 'absolute',
    right: -100,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'red',
  },
}));

type NotificationsDialogProps = {
  readonly lang: Language;
};

export const NotificationDialog = ({ lang }: NotificationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const { state } = useAuth();
  const { t } = useTranslation(lang, 'notifications');
  const router = useRouter();

  const { data, refetch } = useQuery<GetNotificationsDTO>({
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

  const handleClickArticleModeration = (url: string, id: number) => {
    router.push(url);
    setOpen(false);
    readNotification(id).then(() => refetch());
  };

  const onPageChange = (value: number) => {
    setCurrentPage(value);
  };

  const onResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
  };

  const handleReadNotification = (id: number) => {
    readNotification(id).then(() => refetch());
  };

  const handleReadAllNotifications = () => {
    readAllNotifications().then(() => refetch());
  };

  const handleDeleteNotification = (id: number) => {
    deleteNotification(id).then(() => refetch());
  };

  const handleDeleteReadNotifications = () => {
    deleteReadNotifications().then(() => refetch());
  };

  const handleDeleteSystemNotification = (id: number) => {
    deleteSystemNotification(id).then(() => refetch());
  };

  const handleDeleteAllSystemNotifications = () => {
    deleteAllSystemNotifications().then(() => refetch());
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
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {t('notifications')}
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
            <List>
              {notifications?.map((notification, id) => (
                <Fragment key={id}>
                  <BadgeDialog
                    invisible={
                      notification.read ||
                      notification.type === NotificationType.SYSTEM
                    }
                    badgeContent=' '
                  >
                    <ListItem alignItems='flex-start'>
                      <ListItemText
                        primary={
                          <Stack
                            direction='row'
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            {notification.type === NotificationType.SYSTEM && (
                              <WarningAmberIcon color='warning' />
                            )}
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='div'
                            >
                              {notification.title}
                            </Typography>
                            {notification.type === NotificationType.SYSTEM && (
                              <WarningAmberIcon color='warning' />
                            )}
                            {state.user?.role === UserRole.ROLE_ADMIN &&
                              notification.type === NotificationType.SYSTEM && (
                                <>
                                  <Button
                                    className='article-btn'
                                    variant='outlined'
                                    onClick={() =>
                                      handleDeleteSystemNotification(
                                        notification.id,
                                      )
                                    }
                                  >
                                    Удалить
                                  </Button>
                                  <EditNotification
                                    id={notification.id}
                                    refetch={refetch}
                                    lang={lang}
                                  />
                                </>
                              )}
                          </Stack>
                        }
                        secondary={
                          <>
                            <Typography
                              component='span'
                              variant='body2'
                              sx={{ color: 'text.primary', display: 'inline' }}
                            >
                              {notification.message}
                              {notification.type ===
                                NotificationType.ARTICLE_MODERATION && (
                                <Link
                                  onClick={() =>
                                    handleClickArticleModeration(
                                      `/${lang}/articles/${notification.articleId}`,
                                      notification.id,
                                    )
                                  }
                                >
                                  <br />
                                  <Button
                                    className='article-btn'
                                    variant='outlined'
                                  >
                                    Проверить
                                  </Button>
                                  <Button
                                    className='article-btn'
                                    variant='outlined'
                                    onClick={() =>
                                      handleDeleteNotification(notification.id)
                                    }
                                  >
                                    Удалить
                                  </Button>
                                </Link>
                              )}
                              {(notification.type ===
                                NotificationType.COMMENT_MODERATION ||
                                notification.type ===
                                  NotificationType.COMMENT_REPLIED) && (
                                <Link
                                  onClick={() =>
                                    handleClickArticleModeration(
                                      `/${lang}/articles/${notification.articleId}#comment-${notification.commentId}`,
                                      notification.id,
                                    )
                                  }
                                >
                                  <Button
                                    className='article-btn'
                                    variant='outlined'
                                  >
                                    Проверить
                                  </Button>
                                </Link>
                              )}
                            </Typography>
                            {notification.type !== NotificationType.SYSTEM && (
                              <DialogActions>
                                <Button
                                  className='article-btn'
                                  variant='outlined'
                                  onClick={() =>
                                    handleReadNotification(notification.id)
                                  }
                                >
                                  Отметить как прочитанное
                                </Button>
                              </DialogActions>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </BadgeDialog>
                  {notifications.length - 1 !== id && (
                    <Divider component='li' />
                  )}
                </Fragment>
              ))}
            </List>
          </Box>
          <CustomPagination
            lang={lang}
            totalPages={totalPages}
            totalElements={totalElements}
            onCurrentPageChange={onPageChange}
            onResultsPerPageChange={onResultsPerPageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className='article-btn'
            variant='outlined'
            onClick={() => handleReadAllNotifications()}
          >
            Отметить как прочитанные
          </Button>
          <Button
            className='article-btn'
            variant='outlined'
            onClick={() => handleDeleteReadNotifications()}
          >
            Удалить прочитанные
          </Button>
          {state.user?.role === UserRole.ROLE_ADMIN && (
            <Button
              className='article-btn'
              variant='outlined'
              onClick={() => handleDeleteAllSystemNotifications()}
            >
              Удалить системные уведомления
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};
