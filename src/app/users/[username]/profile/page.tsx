"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserByUsername} from "@/helpers/userApi";
import {Button} from "@mui/material";
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {WithAuth} from "@/components/WithAuth";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

type PageParams = {
    username: string
}

type PageProps = {
    params: PageParams
};

function Page({params}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const {state} = useAuth();

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

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);



    return (
        <>
            <Card className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <div className="user-profile-description">О себе</div>
                        <div className="user-profile-content">{user?.bio}</div>
                        <div className="user-categories-profile">Пишет в категориях:
                            <div className="user-tags">{user?.categories.map((category) => (
                                <span className="user-tag-item" key={category.id}>
                            <Link className="user-tag-name" href={`/categories/${category.id}`}>
                                 <Stack direction="row" spacing={1}>
                            <Chip label={category.name} variant="outlined"/>
                                  </Stack>
                            </Link>
                             </span>
                            ))}
                            </div>
                        </div>
                        {state.user?.username === username && (
                            <Link href={`/users/edit/${user?.username}`}><Button type="submit">Update</Button></Link>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default WithAuth(Page)