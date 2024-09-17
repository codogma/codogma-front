"use client";
import * as React from 'react';
import {memo, useState} from 'react';
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
import LanguageIcon from '@mui/icons-material/Language';
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";
import {ThemeToggleButton} from "@/components/ThemeContext";
import {ButtonGroup} from "@mui/material";
import {logout} from "@/helpers/authApi";
import {UserRole} from "@/types";
import {useRouter} from "next/navigation";
import {AvatarImage} from "@/components/AvatarImage";
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import CreateIcon from "@mui/icons-material/Create";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const {state} = useAuth();

    const handleLogout = () => {
        logout().then(() => router.push('/articles'));
        handleCloseUserMenu();
    };

    const handleProfile = () => {
        router.push(`/users/${state.user?.username}`);
        handleCloseUserMenu();
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar className="nav-app-bar">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Link href="/">
                        <Typography
                            variant="h5"
                            noWrap
                            component="h5"
                            sx={{
                                mr: 2,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LINKED<StickyNote2OutlinedIcon/>
                        </Typography>
                    </Link>
                    <ButtonGroup variant="text" sx={{display: {xs: 'flex'}, mr: 1, ml: 'auto', color: "inherit"}}>
                        <Link href="/articles/#search-input">
                            <IconButton color="inherit">
                                <SearchIcon/>
                            </IconButton>
                        </Link>
                        <IconButton color="inherit">
                            <LanguageIcon/>
                        </IconButton>
                        <ThemeToggleButton sx={{color: "inherit"}}/>
                    </ButtonGroup>
                    <Box sx={{flexGrow: 0}}>
                        {!state.isAuthenticated && (
                            <>
                                <IconButton onClick={handleOpenUserMenu} color="inherit" sx={{p: 0}}>
                                    <AvatarImage
                                        alt={state.user?.username} key={new Date().getTime()}
                                        variant="rounded"
                                        src={undefined} size={40}/>
                                </IconButton>
                                <Menu
                                    sx={{mt: '45px'}}
                                    id="menu-appbar"
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
                                    <Link href={`/sign-up`}>
                                        <MenuItem>
                                            <Typography
                                                textAlign="center"><PersonAddAltRoundedIcon className="mr-2"
                                                                                            fontSize="small"/>Sign
                                                up</Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link href={`/sign-in`}>
                                        <MenuItem>
                                            <Typography textAlign="center"><LoginIcon className="mr-2"
                                                                                      fontSize="small"/>Sign
                                                in</Typography>
                                        </MenuItem>
                                    </Link>
                                </Menu>
                            </>
                        )}
                        {state.isAuthenticated && (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} color="inherit" sx={{p: 0}}>
                                        <AvatarImage alt={state.user?.username} key={new Date().getTime()}
                                                     variant="rounded"
                                                     src={state.user?.avatarUrl} size={40}/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '45px'}}
                                    id="menu-appbar"
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
                                    <MenuItem onClick={handleProfile}>
                                        <Typography
                                            textAlign="center"><PersonIcon className="mr-2"
                                                                           fontSize="small"/>Profile</Typography>
                                    </MenuItem>
                                    {state.user?.role === UserRole.ROLE_AUTHOR && (
                                        <Link href={`/create-article`}>
                                            <MenuItem>
                                                <Typography textAlign="center"><CreateIcon className="mr-2"
                                                                                           fontSize="small"/>Create
                                                    article</Typography>
                                            </MenuItem>
                                        </Link>
                                    )}
                                    {state.user?.role === UserRole.ROLE_ADMIN && (
                                        <Link href={`/create-category`}>
                                            <MenuItem>
                                                <Typography textAlign="center"><CategoryIcon className="mr-2"
                                                                                             fontSize="small"/>Create
                                                    category</Typography>
                                            </MenuItem>
                                        </Link>
                                    )}
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center"><LogoutIcon className="mr-2" fontSize="small"/>Log
                                            out</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default memo(NavBar);
