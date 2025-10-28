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
import { ThemeProviderProps } from '@mui/material/styles/ThemeProvider';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useRef, useState } from 'react';

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
import { Language, UserRole } from '@/types';

type NavBarProps = {
  readonly lang: Language;
  readonly session: Session | null;
  readonly theme: ThemeProviderProps['defaultMode'];
};

export const NavBar = ({ lang, session, theme }: NavBarProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [compilationDialogOpen, setCompilationDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { data: clientSession, status } = useSession();
  const currentSession = clientSession || session;
  const isAuthenticated =
    status === 'authenticated' || (status === 'loading' && !!session);
  const t = useTranslations();

  const handleLogout = () => {
    logout().finally(() => signOut({ redirect: true, redirectTo: `/${lang}` }));
    handleCloseUserMenu();
  };

  const handleClickMenuItem = (url: string, openInNewTab: boolean = false) => {
    if (openInNewTab) {
      const fullUrl = `/${lang}/${url}`;
      window.open(fullUrl, '_blank');
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar className='nav-app-bar'>
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href={`/${lang}`}>
            <Typography
              variant='h5'
              noWrap
              component='h5'
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              CODOGMA
            </Typography>
          </Link>
          <SearchButton
            onRef={searchInputRef}
            onClick={handleOpenSearchDialog}
            sx={{
              mr: 1,
              ml: 'auto',
            }}
          />
          <Divider
            orientation='vertical'
            variant='middle'
            flexItem
            sx={{
              display: { xs: 'none', sm: 'inherit' },
            }}
          />
          <ButtonGroup
            variant='text'
            sx={{
              display: { xs: 'flex' },
              mr: 1,
              color: 'inherit',
              alignItems: 'center',
            }}
          >
            <LocalizationDialog lang={lang} />
            <ThemeToggleButton title={t('theme')} theme={theme} />
            <NotificationDialog lang={lang} />
          </ButtonGroup>
          <SearchDialog
            open={searchDialogOpen}
            onClose={handleCloseSearchDialog}
            anchorEl={searchInputRef.current}
          />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('settings')}>
              <IconButton
                onClick={handleOpenUserMenu}
                color='inherit'
                sx={{ p: 0 }}
              >
                <AvatarImage
                  alt={currentSession?.user.name ?? ''}
                  src={currentSession?.user.image ?? ''}
                  priority
                  variant='circular'
                  size={40}
                  type='avatar'
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!isAuthenticated ? (
                <MenuList className='menu-list'>
                  <MenuItem onClick={() => handleClickMenuItem('sign-up')}>
                    <Typography textAlign='center'>
                      <PersonAddAltRoundedIcon
                        className='mr-2'
                        fontSize='small'
                      />
                      {t('signUpBtn')}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickMenuItem('sign-in')}>
                    <Typography textAlign='center'>
                      <LoginIcon className='mr-2' fontSize='small' />
                      {t('signInBtn')}
                    </Typography>
                  </MenuItem>
                </MenuList>
              ) : (
                <MenuList className='menu-list'>
                  <MenuItem
                    onClick={() =>
                      handleClickMenuItem(`users/${currentSession?.user?.name}`)
                    }
                  >
                    <Typography textAlign='center'>
                      <PersonIcon className='mr-2' fontSize='small' />
                      {t('profile')}
                    </Typography>
                  </MenuItem>
                  {isAuthenticated &&
                    currentSession?.user.role !== UserRole.ROLE_ADMIN && (
                      <>
                        <MenuItem onClick={() => handleOpenCompilationDialog()}>
                          <Typography textAlign='center'>
                            <AddCircleIcon className='mr-2' fontSize='small' />
                            {t('createCompilationBtn')}
                          </Typography>
                        </MenuItem>
                        <CompilationDialog
                          open={compilationDialogOpen}
                          onClose={handleCloseCompilationDialog}
                          lang={lang}
                        />
                      </>
                    )}
                  {currentSession?.user.role === UserRole.ROLE_AUTHOR && (
                    <MenuItem
                      onClick={() => handleClickMenuItem('article-editor')}
                    >
                      <Typography textAlign='center'>
                        <CreateIcon className='mr-2' fontSize='small' />
                        {t('createArticleBtn')}
                      </Typography>
                    </MenuItem>
                  )}
                  {currentSession?.user.role === UserRole.ROLE_ADMIN && (
                    <>
                      <MenuItem onClick={() => handleOpenCategoryDialog()}>
                        <Typography textAlign='center'>
                          <CategoryIcon className='mr-2' fontSize='small' />
                          {t('createCategoryBtn')}
                        </Typography>
                      </MenuItem>
                      <CategoryDialog
                        open={categoryDialogOpen}
                        onClose={handleCloseCategoryDialog}
                        lang={lang}
                      />
                      <MenuItem
                        onClick={() => handleClickMenuItem('admin', true)}
                      >
                        <Typography textAlign='center'>
                          <AdminPanelSettingsIcon
                            className='mr-2'
                            fontSize='small'
                          />
                          {t('adminPanelBtn')}
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={() => handleOpenNotificationDialog()}>
                        <Typography textAlign='center'>
                          <EditNotificationsIcon
                            className='mr-2'
                            fontSize='small'
                          />
                          {t('createNotificationBtn')}
                        </Typography>
                      </MenuItem>
                      <SystemNotificationDialog
                        open={notificationDialogOpen}
                        onClose={handleCloseNotificationDialog}
                        lang={lang}
                      />
                    </>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign='center'>
                      <LogoutIcon className='mr-2' fontSize='small' />
                      {t('logoutBtn')}
                    </Typography>
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
