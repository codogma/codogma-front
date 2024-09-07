"use client";
import * as React from 'react';
import {memo} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useAuth} from "@/components/AuthProvider";
import {ButtonGroup} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import Typography from "@mui/material/Typography";

const Footer = () => {
    const {state} = useAuth();
    console.log(state);


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
                            color: '#BBCDD6',
                            fontSize: '.875rem',
                            textDecoration: 'none',
                        }}
                    >
                        ©Linkednote
                    </Typography>
                    <>
                        <Button color="inherit">Техническая поддержка</Button>
                        <Button color="inherit">Настройка языка</Button>
                    </>
                    <Box sx={{flexGrow: 0}}>
                        <>
                            <ButtonGroup variant="text" sx={{display: {xs: 'flex'}, mr: 1, ml: 'auto', color: "inherit"}}>
                                    <IconButton color="inherit">
                                        <FacebookIcon/>
                                    </IconButton>
                                    <IconButton color="inherit">
                                        <XIcon/>
                                    </IconButton>
                                    <IconButton color="inherit">
                                        <YouTubeIcon/>
                                    </IconButton>
                                <IconButton color="inherit">
                                    <TelegramIcon/>
                                </IconButton>
                            </ButtonGroup>
                        </>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default memo(Footer);
