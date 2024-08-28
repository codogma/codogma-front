"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserByUsername} from "@/helpers/userApi";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Avatar} from "@mui/material";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

type PageParams = {
    username: string
}

type PageProps = {
    params: PageParams
};


function Page({params}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);

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
        <>
            {users && users?.map((user) => (
                <Card key={user.username} className="itb-user">
                    <CardContent>
                        <div className="user-meta-container">
                            <Avatar
                                className="user-avatar"
                                src={user.avatarUrl}
                                {...(user.avatarUrl.length !== 0 ? stringAvatar(user.username) : {})}
                                variant="rounded"
                            />
                        </div>
                        <Link
                            href={`/users/${user.firstName}${user.lastName}`}
                            className="user-title">{user.firstName} {user.lastName}</Link>
                        <Link
                            href={`/users/${user.username}`} className="user-nickname">@{user.username}</Link>
                        <div className="user-description">{user.bio}</div>
                        <div className="user-item_categories">Пишет в категориях:
                            <div className="user-tags">{user.categories.map((category) => (
                                <span className="user-tag-item" key={category.id}>
                            <Link className="user-tag-name" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                            ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}


export default Page
