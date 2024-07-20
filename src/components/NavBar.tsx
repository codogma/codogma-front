"use client";
import * as React from 'react';
import {useState} from 'react';
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
import {logout} from "@/helpers/authApi";
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";

export const NavBar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const {state} = useAuth();

    const handleLogout = () => {
        // logout();
        handleCloseUserMenu();
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
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
                    <SearchIcon sx={{display: {xs: 'flex'}, mr: 1}}/>
                    <Link href={`/posts/create`}><CreateIcon sx={{display: {xs: 'flex'}, mr: 1}}/></Link>
                    <Link href={`/categories/create`}><CategoryIcon sx={{display: {xs: 'flex'}, mr: 1}}/></Link>
                    <PreviewIcon sx={{display: {xs: 'flex'}, mr: 1}}/>
                    <Box sx={{flexGrow: 0}}>
                        {!state.isAuthenticated && (
                            <>
                                <Link href={`/register`}><Button color="inherit">Register</Button></Link>
                                <Link href={`/login`}><Button color="inherit">Log in</Button></Link>
                            </>
                        )}
                        {state.isAuthenticated &&
                            (<>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
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
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Log out</Typography>
                                    </MenuItem>
                                </Menu>
                            </>)}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}