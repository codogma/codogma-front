import { Close as CloseIcon } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Button,
  ButtonGroup,
  CardActions,
  Dialog,
  DialogTitle,
  List,
  ListItem,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Fragment, useState } from 'react';

import { CustomPagination } from '@/components/CustomPagination';
import { EditNotification } from '@/components/EditNotification';
import { Scrollbar } from '@/components/Scrollbar';
import { NOTIFICATIONS_PER_PAGE } from '@/constants/limits';
import { dispatchCustomEvent } from '@/helpers/dispatchCustomEvent';
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
import { useEventListener } from '@/helpers/useEventListener';
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
    top: '25%',
    left: -5,
    transform: 'translateY(-25%)',
    color: 'red',
  },
}));

type NotificationsDialogProps = {
  readonly lang: Language;
};

export const NotificationDialog = ({ lang }: NotificationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [resultsPerPage, setResultsPerPage] = useState<number>(
    NOTIFICATIONS_PER_PAGE,
  );
  const { data: state } = useSession();
  const t = useTranslations('notificationsPage');
  const router = useRouter();
  const pathname = usePathname();

  const { data, refetch } = useQuery<GetNotificationsDTO>({
    queryKey: ['notifications', currentPage, resultsPerPage],
    queryFn: () => {
      return getNotifications(undefined, currentPage, resultsPerPage);
    },
  });

  useEventListener('notification', () => refetch());

  useEventListener('storage', () => refetch());

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
    router.replace(url);
    dispatchCustomEvent('remove-active', {
      message: '',
      severity: 'success',
    });
    setOpen(false);
    handleReadNotification(id);
  };

  const handleClickCommentModeration = (
    url: string,
    articleId: number,
    notificationId: number,
  ) => {
    if (pathname.endsWith(`${articleId}`)) {
      router.replace(url);
      window.history.replaceState(null, '', url);
    } else {
      router.push(url);
    }
    dispatchCustomEvent('searchOrHashChange', {
      message: '',
      severity: 'success',
    });
    setOpen(false);
    handleReadNotification(notificationId);
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
          <Scrollbar
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              minWidth: 420,
              width: 'fit-content',
              gap: 2,
            }}
          >
            <List>
              {notifications?.map((notification, id) => (
                <Fragment key={notification.id}>
                  <BadgeDialog
                    invisible={
                      notification.read ||
                      notification.type === NotificationType.SYSTEM
                    }
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    badgeContent={<NotificationsActiveIcon />}
                  >
                    <ListItem alignItems='flex-start'>
                      <Card elevation={0}>
                        <CardContent>
                          <Stack
                            direction='row'
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
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
                          </Stack>
                          <Typography
                            component='span'
                            variant='body2'
                            sx={{
                              color: 'text.secondary',
                            }}
                          >
                            {notification.message}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <ButtonGroup size='small'>
                            {state?.user?.role === UserRole.ROLE_ADMIN &&
                              notification.type === NotificationType.SYSTEM && (
                                <Button
                                  onClick={() =>
                                    handleDeleteSystemNotification(
                                      notification.id,
                                    )
                                  }
                                >
                                  Удалить
                                </Button>
                              )}
                            {state?.user?.role === UserRole.ROLE_ADMIN &&
                              notification.type === NotificationType.SYSTEM && (
                                <EditNotification
                                  id={notification.id}
                                  refetch={refetch}
                                  lang={lang}
                                />
                              )}
                            {notification.type ===
                              NotificationType.ARTICLE_MODERATION && (
                              <Button
                                onClick={() =>
                                  handleClickArticleModeration(
                                    `/${lang}/articles/${notification.articleId}`,
                                    notification.id,
                                  )
                                }
                              >
                                Проверить
                              </Button>
                            )}
                            {notification.type ===
                              NotificationType.ARTICLE_MODERATION && (
                              <Button
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                              >
                                Удалить
                              </Button>
                            )}
                            {(notification.type ===
                              NotificationType.COMMENT_MODERATION ||
                              notification.type ===
                                NotificationType.COMMENT_REPLIED) && (
                              <Button
                                onClick={() =>
                                  handleClickCommentModeration(
                                    `/${lang}/articles/${notification.articleId}#comment-${notification.commentId}`,
                                    notification.articleId,
                                    notification.id,
                                  )
                                }
                              >
                                Проверить
                              </Button>
                            )}
                            {notification.type !== NotificationType.SYSTEM && (
                              <Button
                                onClick={() =>
                                  handleReadNotification(notification.id)
                                }
                              >
                                Отметить как прочитанное
                              </Button>
                            )}
                          </ButtonGroup>
                        </CardActions>
                      </Card>
                    </ListItem>
                  </BadgeDialog>
                  {notifications.length - 1 !== id && (
                    <Divider component='li' />
                  )}
                </Fragment>
              ))}
            </List>
          </Scrollbar>
          <CustomPagination
            totalPages={totalPages}
            totalElements={totalElements}
            onCurrentPageChange={onPageChange}
            onResultsPerPageChange={onResultsPerPageChange}
            resultsPerPageStart={NOTIFICATIONS_PER_PAGE}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup size='small'>
            <Button onClick={() => handleReadAllNotifications()}>
              Отметить как прочитанные
            </Button>
            <Button onClick={() => handleDeleteReadNotifications()}>
              Удалить прочитанные
            </Button>
            {state?.user?.role === UserRole.ROLE_ADMIN && (
              <Button onClick={() => handleDeleteAllSystemNotifications()}>
                Удалить системные уведомления
              </Button>
            )}
          </ButtonGroup>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};
