"use client"
import * as React from 'react';
import {FormEvent} from 'react';
import {Box, TextField, Button} from "@mui/material";
import {register} from "@/src/helpers/auth-api";

type User = {
    username: string
    email: string
    password: string
}

export default function LoginPage() {
    return (
        <Stack
            component="form"
            sx={{
                width: '25ch',
            }}
            spacing={2}
            noValidate
            autoComplete="off"
        >
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Username</InputLabel>
                <Input id="component-simple"/>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Email</InputLabel>
                <Input id="component-simple"/>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Password</InputLabel>
                <Input id="component-simple"/>
            </FormControl>
            <Button variant="contained">Submit</Button>
        </Stack>
    );
}

