"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserByUsername} from "@/helpers/userApi";
import {Avatar, Box, Button} from "@mui/material";
import Link from "next/link";
import {LinkTabProps} from "@/components/NavTabs";

type PageParams = {
    username: string
}

type PageProps = {
    params: PageParams
};
export default function Layout({params}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();

    const tabs: LinkTabProps[] = [
        {label: 'Articles', href: `/users/${username}/articles`},
        {label: 'Profile', href: `/users/${username}/profile`},
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserByUsername(username);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [username])

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <Box
                component="form"
                noValidate
                sx={{
                    m: 1, width: '25ch',
                }}
                autoComplete="off"
            >
                <Avatar variant="rounded" src={user?.avatarUrl} sx={{width: 112, height: 112}}/>
                <p className="article-title">{user?.username}</p>
                <p className="article-title">{user?.email}</p>
                <p className="article-title">{user?.firstName}</p>
                <p className="article-title">{user?.lastName}</p>
                <p className="article-title">{user?.bio}</p>
                {user?.username === username && (
                    <Link href={`/users/edit/${user?.username}`}><Button type="submit">Update</Button></Link>
                )}
            </Box>
        </main>
    );
}