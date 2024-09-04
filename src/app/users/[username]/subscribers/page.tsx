"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserByUsername} from "@/helpers/userApi";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Avatar, Box} from "@mui/material";

type PageParams = {
    username: string;
};

type PageProps = {
    params: PageParams;
};

const Page = ({params}: PageProps) => {
    const username: string = params.username;
    const [subscribers, setSubscribers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserByUsername(username);
                setSubscribers(user.subscribers);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {subscribers && subscribers?.map((user) => (
                <Card key={user.username} variant="outlined" className="card">
                    <CardContent className="card-content">
                        <Box className="meta-container">
                            <>
                                <Avatar
                                    className="article-user-avatar"
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    variant="rounded"
                                />
                                <Link href={`/users/${user.username}`}
                                      className="subscribers-user-name">@{user.username}</Link>
                            </>
                            <div className="subscribers-user-description">{user.shortInfo}</div>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

export default Page