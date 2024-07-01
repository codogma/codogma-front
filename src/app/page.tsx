"use client"
import React, {useEffect, useState} from "react";
import {Button} from "@mui/material";
import Link from "next/link";
import {logout} from "@/helpers/auth-api";


export default function Page() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const onClick = () => {
        logout()
        setIsAuthenticated(false)
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [isAuthenticated])

    return (
        <>
            {!isAuthenticated && (
                <>
                    <Link href={`/register`}><Button type="submit">Register</Button></Link>
                    <Link href={`/login`}><Button type="submit">Log in</Button></Link>
                </>
            )}
            {isAuthenticated && (<Button type="submit" onClick={onClick}>Log out</Button>)}
        </>
    );
}