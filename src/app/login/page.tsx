"use client"
import * as React from 'react';
import {FormEvent} from 'react';
import {Box, Button, TextField} from "@mui/material";
import {login} from "@/helpers/authApi";
import {useRouter} from "next/navigation";


type User = {
    usernameOrEmail: string
    password: string
}

export default function LoginPage() {
    const router = useRouter();
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user: User = Object.fromEntries(formData.entries()) as User
        login(user)
        router.push("/");
        console.log(user);
    }
    return (
        <>
            <Box
                component="form"
                noValidate
                sx={{
                    m: 1, width: '25ch',
                }}
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <TextField id="usernameOrEmail" name="usernameOrEmail" label="Username or Email" variant="standard"/>
                <TextField id="password" name="password" label="Password" variant="standard" type="password"/>
                <Button type="submit">Sign in</Button>
            </Box>
        </>
    );
}

