"use client";
import * as React from 'react';
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

export const ColorModeProvider = ({children}: { children: React.ReactNode }) => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');

    React.useEffect(() => {
        const savedMode = localStorage.getItem('theme-mode');
        if (savedMode === 'dark') {
            setMode('dark');
        } else {
            setMode('light');
        }
    }, []);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('theme-mode', newMode);
                    return newMode;
                });
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export const useColorMode = () => React.useContext(ColorModeContext);

interface ThemeToggleButtonProps {
    sx?: object;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({sx}) => {
    const theme = useTheme();
    const colorMode = useColorMode();

    return (
        <IconButton sx={sx} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
        </IconButton>
    );
};