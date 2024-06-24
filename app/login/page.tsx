"use client"
import * as React from 'react';
import {Box, TextField, Button} from "@mui/material";
import {FormEvent} from "react";
import {login} from "@/src/helpers/auth-api";

type User = {
    username: string
    email: string
    password: string
}

export default function LoginPage() {
const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user: User = Object.fromEntries(formData.entries()) as User
    login(user)
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
            <TextField id="username" name="username" label="Username or Email" variant="standard" />
            <TextField id="password" name="password" label="Password" variant="standard" />
            <Button type="submit">Sign in</Button>
        </Box>
      </>
    );
}

