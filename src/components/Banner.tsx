"use client";
import React from 'react';
import {Paper, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from "@mui/material/Box";

const Banner = () => {
    return (
        <Paper
            sx={{
                backgroundImage: 'url(/images/banner.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px',
                color: '#fff',
                textAlign: 'center',
                borderRadius: '8px',
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid size={{xs: 12, md: 3}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Let us introduce you to our learning platform.
                    </Typography>
                </Grid>

                <Grid size={{xs: 12, md: 9}}>
                    <Grid container spacing={2}>
                        {Array.from({length: 4}).map((_, index) => (
                            <Grid size={{xs: 6}} key={index}>
                                <Box
                                    sx={{
                                        width: '400px',
                                        height: '140px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        backgroundColor: '#ffffff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '1px solid #ddd'
                                    }}
                                >
                                    <Typography variant="h6" color="textSecondary"/>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Banner;
