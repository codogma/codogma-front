"use client"
import * as React from 'react';
import {FormEvent} from 'react';
import {Box, TextField, Button} from "@mui/material";
import {register} from "@/helpers/auth-api";
import {useRouter} from "next/navigation";

type User = {
    username: string
    email: string
    password: string
}

export default function RegisterPage() {
    const router = useRouter();
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user: User = Object.fromEntries(formData.entries()) as User
        register(user)
        router.push("/login")
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
                <TextField id="username" name="username" label="Username" variant="standard" />
                <TextField id="email" name="email" label="Email" variant="standard" />
                <TextField id="password" name="password" label="Password" variant="standard" type="password"/>
                <Button type="submit">Register</Button>
            </Box>
        </>
    );
}

