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
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";
import {ThemeToggleButton} from "@/components/ThemeContext";
import {ButtonGroup} from "@mui/material";
import {logout} from "@/helpers/authApi";
import {UserRole} from "@/types";
import {useRouter} from "next/navigation";
import {AvatarImage} from "@/components/AvatarImage";

const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const {state} = useAuth();
    console.log(state);

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
        <AppBar position="sticky">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LINKEDNOTE
                    </Typography>
                    <ButtonGroup variant="text" sx={{display: {xs: 'flex'}, mr: 1, ml: 'auto', color: "inherit"}}>
                        <Link href="/articles/#search-input">
                            <IconButton color="inherit">
                                <SearchIcon/>
                            </IconButton>
                        </Link>
                        {state.user?.role === UserRole.ROLE_AUTHOR && (
                            <Link href={`/create-article`}>
                                <IconButton color="inherit">
                                    <CreateIcon/>
                                </IconButton>
                            </Link>
                        )}
                        {state.user?.role === UserRole.ROLE_ADMIN && (
                            <Link href={`/create-category`}>
                                <IconButton color="inherit">
                                    <CategoryIcon/>
                                </IconButton>
                            </Link>
                        )}
                        <IconButton color="inherit">
                            <LanguageIcon/>
                        </IconButton>
                        <ThemeToggleButton sx={{color: "inherit"}}/>
                    </ButtonGroup>
                    <Box sx={{flexGrow: 0}}>
                        {!state.isAuthenticated && (
                            <>
                                <Link href={`/register`}><Button color="inherit">Register</Button></Link>
                                <Link href={`/login`}><Button color="inherit">Log in</Button></Link>
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
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Log out</Typography>
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
