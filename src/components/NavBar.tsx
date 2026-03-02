'use client';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { ButtonGroup, Divider, MenuList } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { CategoryDialog } from '@/components/CategoryDialog';
import { CompilationDialog } from '@/components/CompilationDialog';
import { LocalizationDialog } from '@/components/LocalizationDialog';
import { NotificationDialog } from '@/components/NotificationDialog';
import { SearchButton } from '@/components/SearchButton';
import { SearchDialog } from '@/components/SearchDialog';
import { SystemNotificationDialog } from '@/components/SystemNotificationDialog';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { logout } from '@/helpers/authApi';
import { Language, ThemeProviderProps, UserRole } from '@/types';

type NavBarProps = {
  readonly lang: Language;
  readonly session: Session | null;
  readonly theme: ThemeProviderProps['defaultMode'];
};

export const NavBar = ({ lang, session, theme }: NavBarProps) => {
  const muiTheme = useTheme();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [compilationDialogOpen, setCompilationDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const [searchAnchorEl, setSearchAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const router = useRouter();
  const { data: clientSession, status } = useSession();
  const currentSession = clientSession || session;
  const isAuthenticated =
    status === 'authenticated' || (status === 'loading' && !!session);
  const t = useTranslations();

  // Синхронизация searchAnchorEl с реальным элементом кнопки
  useEffect(() => {
    if (searchDialogOpen && searchButtonRef.current) {
      setSearchAnchorEl(searchButtonRef.current);
    } else {
      setSearchAnchorEl(null);
    }
  }, [searchDialogOpen]);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout().finally(() => signOut({ redirect: true, redirectTo: `/${lang}` }));
    handleCloseUserMenu();
  };

  const handleClickMenuItem = (url: string, openInNewTab: boolean = false) => {
    if (openInNewTab) {
      const fullUrl = `/${lang}/${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/${lang}/${url}`);
    }
    handleCloseUserMenu();
  };

  const handleOpenCompilationDialog = () => {
    setCompilationDialogOpen(true);
    handleCloseUserMenu();
  };

  const handleCloseCompilationDialog = () => {
    setCompilationDialogOpen(false);
    handleCloseUserMenu();
  };

  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(true);
    handleCloseUserMenu();
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    handleCloseUserMenu();
  };

  const handleOpenNotificationDialog = () => {
    setNotificationDialogOpen(true);
    handleCloseUserMenu();
  };

  const handleCloseNotificationDialog = () => {
    setNotificationDialogOpen(false);
    handleCloseUserMenu();
  };

  const handleOpenSearchDialog = () => {
    setSearchDialogOpen(true);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialogOpen(false);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // Формируем пункты меню без использования Fragment
  const guestMenuItems: React.ReactElement[] = [
    <MenuItem key='sign-up' onClick={() => handleClickMenuItem('sign-up')}>
      <Typography textAlign='center'>
        <PersonAddAltRoundedIcon className='mr-2' fontSize='small' />
        {t('signUpBtn')}
      </Typography>
    </MenuItem>,
    <MenuItem key='sign-in' onClick={() => handleClickMenuItem('sign-in')}>
      <Typography textAlign='center'>
        <LoginIcon className='mr-2' fontSize='small' />
        {t('signInBtn')}
      </Typography>
    </MenuItem>,
  ];

  const authMenuItems: React.ReactElement[] = [
    <MenuItem
      key='profile'
      onClick={() =>
        handleClickMenuItem(`users/${currentSession?.user?.name ?? ''}`)
      }
    >
      <Typography textAlign='center'>
        <PersonIcon className='mr-2' fontSize='small' />
        {t('profile')}
      </Typography>
    </MenuItem>,
    ...(isAuthenticated && currentSession?.user.role !== UserRole.ROLE_ADMIN
      ? [
          <MenuItem
            key='create-compilation'
            onClick={handleOpenCompilationDialog}
          >
            <Typography textAlign='center'>
              <AddCircleIcon className='mr-2' fontSize='small' />
              {t('createCompilationBtn')}
            </Typography>
          </MenuItem>,
        ]
      : []),
    ...(currentSession?.user.role === UserRole.ROLE_AUTHOR
      ? [
          <MenuItem
            key='create-article'
            onClick={() => handleClickMenuItem('article-editor')}
          >
            <Typography textAlign='center'>
              <CreateIcon className='mr-2' fontSize='small' />
              {t('createArticleBtn')}
            </Typography>
          </MenuItem>,
        ]
      : []),
    ...(currentSession?.user.role === UserRole.ROLE_ADMIN
      ? [
          <MenuItem key='create-category' onClick={handleOpenCategoryDialog}>
            <Typography textAlign='center'>
              <CategoryIcon className='mr-2' fontSize='small' />
              {t('createCategoryBtn')}
            </Typography>
          </MenuItem>,
          <MenuItem
            key='admin-panel'
            onClick={() => handleClickMenuItem('admin', true)}
          >
            <Typography textAlign='center'>
              <AdminPanelSettingsIcon className='mr-2' fontSize='small' />
              {t('adminPanelBtn')}
            </Typography>
          </MenuItem>,
          <MenuItem
            key='create-system-notification'
            onClick={handleOpenNotificationDialog}
          >
            <Typography textAlign='center'>
              <EditNotificationsIcon className='mr-2' fontSize='small' />
              {t('createNotificationBtn')}
            </Typography>
          </MenuItem>,
        ]
      : []),
    <MenuItem key='logout' onClick={handleLogout}>
      <Typography textAlign='center'>
        <LogoutIcon className='mr-2' fontSize='small' />
        {t('logoutBtn')}
      </Typography>
    </MenuItem>,
  ];

  return (
    <>
      <AppBar
        className='nav-app-bar paper-texture paper-edge'
        position='sticky'
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: (theme) =>
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '64px !important',
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Логотип с градиентом и анимацией */}
            <Link
              href={`/${lang}`}
              style={{ textDecoration: 'none' }}
              className='group'
            >
              <Typography
                variant='h5'
                noWrap
                component='h5'
                sx={{
                  mr: 2,
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: '.25rem',
                  background:
                    muiTheme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8ab4f8 0%, #c58af9 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    filter: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'drop-shadow(0 0 20px rgba(138, 180, 248, 0.5))'
                        : 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.4))',
                  },
                }}
              >
                CODOGMA
              </Typography>
            </Link>

            {/* Кнопка поиска с улучшенным дизайном */}
            <SearchButton
              ref={searchButtonRef}
              onClick={handleOpenSearchDialog}
              sx={{
                mr: 1,
                ml: 'auto',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                border: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                p: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            />

            <Divider
              orientation='vertical'
              variant='middle'
              flexItem
              sx={{
                display: { xs: 'none', sm: 'inherit' },
                mx: 1.5,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
              }}
            />

            {/* Группа инструментов */}
            <ButtonGroup
              variant='text'
              sx={{
                display: { xs: 'flex' },
                mr: 1,
                color: 'inherit',
                alignItems: 'center',
                gap: 0.5,
                '& .MuiButton-root': {
                  minWidth: 'auto',
                  p: 1,
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-1px)',
                  },
                },
              }}
            >
              <LocalizationDialog lang={lang} />
              <ThemeToggleButton title={t('theme')} theme={theme} />
              <NotificationDialog lang={lang} />
            </ButtonGroup>

            <SearchDialog
              open={searchDialogOpen}
              onClose={handleCloseSearchDialog}
              anchorEl={searchAnchorEl}
            />

            {/* Меню пользователя с улучшенным аватаром */}
            <Box sx={{ flexGrow: 0, ml: 1 }}>
              <Tooltip
                title={t('settings')}
                arrow
                slotProps={{ transition: { timeout: 300 } }}
              >
                <IconButton
                  onClick={handleOpenUserMenu}
                  color='inherit'
                  sx={{
                    p: 0,
                    // borderRadius: '16px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '2px solid rgba(255, 255, 255, 0.15)'
                        : '2px solid rgba(0, 0, 0, 0.06)',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      // transform: 'translateY(-1px)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 6px 20px rgba(0, 0, 0, 0.3)'
                          : '0 6px 20px rgba(0, 0, 0, 0.1)',
                      border: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '2px solid rgba(138, 180, 248, 0.5)'
                          : '2px solid rgba(102, 126, 234, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  <AvatarImage
                    alt={currentSession?.user?.name ?? ''}
                    src={currentSession?.user?.image ?? ''}
                    priority
                    variant='circular'
                    size={40}
                    type='avatar'
                    sx={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                slotProps={{
                  paper: {
                    elevation: 8,
                    sx: {
                      mt: 1.5,
                      borderRadius: '18px',
                      border: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(0, 0, 0, 0.06)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      '& .MuiMenuItem-root': {
                        borderRadius: '10px',
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(138, 180, 248, 0.15)'
                              : 'rgba(102, 126, 234, 0.1)',
                          transform: 'translateX(3px)',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuList className='menu-list'>
                  {isAuthenticated ? authMenuItems : guestMenuItems}
                </MenuList>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <CompilationDialog
        open={compilationDialogOpen}
        onClose={handleCloseCompilationDialog}
        lang={lang}
      />
      <CategoryDialog
        open={categoryDialogOpen}
        onClose={handleCloseCategoryDialog}
        lang={lang}
      />
      <SystemNotificationDialog
        open={notificationDialogOpen}
        onClose={handleCloseNotificationDialog}
        lang={lang}
      />
    </>
  );
};
