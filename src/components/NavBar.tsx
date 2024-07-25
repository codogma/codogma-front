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
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import PreviewIcon from '@mui/icons-material/Preview';
import CategoryIcon from '@mui/icons-material/Category';
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";
import {ThemeToggleButton} from "@/components/ThemeContext";
import {ButtonGroup} from "@mui/material";
import {logout} from "@/helpers/authApi";
import {UserRole} from "@/types";
import {useRouter} from "next/navigation";

const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const {state} = useAuth();
    console.log(state)

    const handleLogout = () => {
        logout().then(() => router.push('/posts'));
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
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/posts"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'flex'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        IT BLOG
                    </Typography>
                    <ButtonGroup variant="text" sx={{display: {xs: 'flex'}, mr: 1, color: "inherit"}}>
                        <IconButton color="inherit">
                            <SearchIcon/>
                        </IconButton>
                        {state.user?.role === UserRole.ROLE_AUTHOR && (
                            <Link href={`/posts/create`}>
                                <IconButton color="inherit">
                                    <CreateIcon/>
                                </IconButton>
                            </Link>
                        )}
                        {state.user?.role === UserRole.ROLE_ADMIN && (
                            <Link href={`/categories/create`}>
                                <IconButton color="inherit">
                                    <CategoryIcon/>
                                </IconButton>
                            </Link>
                        )}
                        <IconButton color="inherit">
                            <PreviewIcon/>
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
                                        <AccountCircle/>
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