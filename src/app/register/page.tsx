"use client"
import * as React from 'react';
import {FormEvent} from 'react';
import {Box, Button, TextField} from "@mui/material";
import {styled} from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useRouter} from "next/navigation";
import {register} from "@/helpers/authApi";


type User = {
    username: string
    email: string
    password: string,
    avatar: File
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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
                <TextField id="username" name="username" label="Username" variant="standard"/>
                <TextField id="email" name="email" label="Email" variant="standard"/>
                <TextField id="password" name="password" label="Password" variant="standard" type="password"/>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon/>}
                >
                    Upload avatar
                    <VisuallyHiddenInput id="avatar" name="avatar" type="file"/>
                </Button>
                <Button type="submit">Register</Button>
            </Box>
        </>
    );
}


