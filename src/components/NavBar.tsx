'use client';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import SearchIcon from '@mui/icons-material/Search';
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
import { LocalizationDialog } from '@/components/LocalizationDialog';
import { ThemeToggleButton } from '@/components/ThemeContext';
import { logout } from '@/helpers/authApi';
import { UserRole } from '@/types';

type NavBarProps = {
  readonly lang: string;
};

const NavBar = ({ lang }: NavBarProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { state } = useAuth();
  const { t } = useTranslation(lang);

  const handleLogout = () => {
    logout().then(() => router.push(`/${lang}`));
    handleCloseUserMenu();
  };

  const handleClickMenuItem = (url: string) => {
    router.push(url);
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
      <Container maxWidth='lg'>
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
            <Tooltip title={t('search')}>
              <Link href={`/${lang}/articles/#search-input`}>
                <IconButton color='inherit'>
                  <SearchIcon />
                </IconButton>
              </Link>
            </Tooltip>
            <LocalizationDialog lang={lang} />
            <ThemeToggleButton title={t('theme')} />
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
                  {state.user?.role === UserRole.ROLE_AUTHOR && (
                    <MenuItem
                      onClick={() => handleClickMenuItem(`/create-article`)}
                    >
                      <Typography textAlign='center'>
                        <CreateIcon className='mr-2' fontSize='small' />
                        {t('createArticleBtn')}
                      </Typography>
                    </MenuItem>
                  )}
                  {state.user?.role === UserRole.ROLE_ADMIN && (
                    <MenuItem
                      onClick={() => handleClickMenuItem(`/create-category`)}
                    >
                      <Typography textAlign='center'>
                        <CategoryIcon className='mr-2' fontSize='small' />
                        {t('createCategoryBtn')}
                      </Typography>
                    </MenuItem>
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
