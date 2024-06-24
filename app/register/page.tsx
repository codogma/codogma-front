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

export default function RegisterPage() {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user: User = Object.fromEntries(formData.entries()) as User
        register(user)
        console.log(user);
    }
    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <TextField id="username" name="username" label="Username" variant="standard" />
                <TextField id="email" name="email" label="Email" variant="standard" />
                <TextField id="password" name="password" label="Password" variant="standard" />
                <Button type="submit">Register</Button>
            </Box>
        </>
    );
}

