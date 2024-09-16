"use client";
import React from "react";
import {useRouter} from "next/navigation";
import {Button, Container, Typography} from "@mui/material";

export default function Page() {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/sign-in");
    };

    return (
        <Container maxWidth="sm" sx={{textAlign: "center", mt: 8}}>
            <>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Registered Successfully
                </Typography>
                <Typography variant="body1" sx={{mb: 4}}>
                    Thank you for confirming your email. You can now sign in to your account.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleRedirect}>
                    Go to Sign In
                </Button>
            </>
        </Container>
    );
}