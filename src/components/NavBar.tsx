'use client';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { ButtonGroup, MenuList } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { memo, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { CategoryDialog } from '@/components/CategoryDialog';
import { CompilationDialog } from '@/components/CompilationDialog';
import { LocalizationDialog } from '@/components/LocalizationDialog';
import { NotificationsDialog } from '@/components/NotificationsDialog';
import { ThemeToggleButton } from '@/components/ThemeContext';
import { logout } from '@/helpers/authApi';
import { UserRole } from '@/types';

type NavBarProps = {
  readonly lang: string;
};

const NavBar = ({ lang }: NavBarProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [compilationDialogOpen, setCompilationDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const router = useRouter();
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  const handleLogout = () => {
    logout().finally(() => router.push(`/${lang}`));
    handleCloseUserMenu();
  };

  const handleClickMenuItem = (url: string) => {
    router.push(`/${lang}/${url}`);
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
          <ButtonGroup
            variant='text'
            sx={{
              display: { xs: 'flex' },
              mr: 1,
              ml: 'auto',
              color: 'inherit',
            }}
          >
            <LocalizationDialog lang={lang} />
            <ThemeToggleButton title={t('theme')} />
            <NotificationsDialog lang={lang} />
          </ButtonGroup>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('settings')}>
              <IconButton
                onClick={handleOpenUserMenu}
                color='inherit'
                sx={{ p: 0 }}
              >
                <AvatarImage
                  key={new Date().getTime()}
                  alt={state.user?.username}
                  src={state.user?.avatarUrl}
                  variant='rounded'
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
              {!state.isAuthenticated ? (
                <MenuList className='nav-menu-list'>
                  <MenuItem onClick={() => handleClickMenuItem(`/sign-up`)}>
                    <Typography textAlign='center'>
                      <PersonAddAltRoundedIcon
                        className='mr-2'
                        fontSize='small'
                      />
                      {t('signUpBtn')}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickMenuItem(`/sign-in`)}>
                    <Typography textAlign='center'>
                      <LoginIcon className='mr-2' fontSize='small' />
                      {t('signInBtn')}
                    </Typography>
                  </MenuItem>
                </MenuList>
              ) : (
                <MenuList className='nav-menu-list'>
                  <MenuItem
                    onClick={() =>
                      handleClickMenuItem(`/users/${state.user?.username}`)
                    }
                  >
                    <Typography textAlign='center'>
                      <PersonIcon className='mr-2' fontSize='small' />
                      {t('profile')}
                    </Typography>
                  </MenuItem>
                  {state.isAuthenticated &&
                    state.user?.role !== UserRole.ROLE_ADMIN && (
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
                  {state.user?.role === UserRole.ROLE_AUTHOR && (
                    <MenuItem
                      onClick={() => handleClickMenuItem(`/article-editor`)}
                    >
                      <Typography textAlign='center'>
                        <CreateIcon className='mr-2' fontSize='small' />
                        {t('createArticleBtn')}
                      </Typography>
                    </MenuItem>
                  )}
                  {state.user?.role === UserRole.ROLE_ADMIN && (
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

export default memo(NavBar);
