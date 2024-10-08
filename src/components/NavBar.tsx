'use client';
import * as React from 'react';
import { memo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ButtonGroup } from '@mui/material';
import { logout } from '@/helpers/authApi';
import { UserRole } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { AvatarImage } from '@/components/AvatarImage';
import CreateIcon from '@mui/icons-material/Create';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { ThemeToggleButton } from '@/components/ThemeContext';
import LanguageIcon from '@mui/icons-material/Language';
import { intlCookie } from '@/app/i18n/settings';
import Cookies from 'js-cookie';
import { useTranslation } from '@/app/i18n/client';

type NavBarProps = {
  lang: string;
};

const NavBar = ({ lang }: NavBarProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
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

  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorElLanguage(null);
  };

  const handleChangeLanguage = (lng: string) => {
    Cookies.set(intlCookie, lng);
    const newPath = pathname.replace(/\/(en|ru)/, `/${lng}`);
    router.push(newPath);
    handleCloseLanguageMenu();
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
            <Tooltip title={t('language')}>
              <IconButton color='inherit' onClick={handleOpenLanguageMenu}>
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLanguage}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElLanguage)}
              onClose={handleCloseLanguageMenu}
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={() => handleChangeLanguage('en')}>
                <Typography textAlign='center'>English</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleChangeLanguage('ru')}>
                <Typography textAlign='center'>Русский</Typography>
              </MenuItem>
            </Menu>
            <Tooltip title={t('theme')}>
              <IconButton color='inherit' sx={{ p: 0 }}>
                <ThemeToggleButton sx={{ color: 'inherit' }} />
              </IconButton>
            </Tooltip>
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
              {!state.isAuthenticated && (
                <>
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
                </>
              )}
              {state.isAuthenticated && (
                <>
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
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default memo(NavBar);
