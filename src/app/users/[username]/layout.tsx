"use client";
import React, {Suspense, useEffect, useState} from 'react';
import {User} from "@/types";
import NavTabs, {LinkTabProps} from "@/components/NavTabs";
import CardContent from "@mui/material/CardContent";
import {Avatar, Badge} from "@mui/material";
import Card from "@mui/material/Card";
import Loading from "@/app/loading";
import {
    getUserByUsername,
    subscribeToUser,
    unsubscribeToUser,
    checkSubscription,
} from "@/helpers/userApi";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";

type PageParams = {
    username: string;
};

type PageProps = {
    params: PageParams;
    children: React.ReactNode;
};

export default function Layout({params, children}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();
    const [isSubscribed, setIsSubscribed] = useState(false);

    const tabs: LinkTabProps[] = [
        {label: 'Profile', href: `/users/${username}/profile`},
        {label: 'Articles', href: `/users/${username}/articles`},
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
    }, [username]);

    useEffect(() => {
        const check = async (username: string) => {
             await checkSubscription(username)
                 .then((response) => setIsSubscribed(response))
                 .catch((error) => console.error('Error checking subscription:', error));
        };
        check(username);
    }, [username]);

    const handleUnsubscribe = async () => {
        await unsubscribeToUser(username)
            .then(() => setIsSubscribed(false))
            .catch((error) => console.error('Error unsubscribing:', error));
    };

    const handleSubscribe = async () => {
        await subscribeToUser(username)
            .then(() => setIsSubscribed(true))
            .catch((error) => console.error('Error subscribing:', error));
    };

    return (
        <section>
            <Card className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <Badge
                            className="items-start"
                            overlap="circular"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={<IconButton component="label" color="inherit" sx={{p: 0}}/>}
                        >
                            <Avatar className="category-img" variant="rounded" src={user?.avatarUrl}>
                                <ImageIcon/>
                            </Avatar>
                        </Badge>
                        <div>

                            {isSubscribed ? (
                                <button className="article-btn" onClick={handleUnsubscribe}>Following</button>
                            ) : (
                                <button className="article-btn" onClick={handleSubscribe}>Follow</button>
                            )}
                        </div>
                        <div>
                            <h1 className="category-card-name">{user?.firstName} {user?.lastName}</h1>
                            <p className="category-card-shortInfo">{user?.shortInfo}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <NavTabs tabs={tabs}/>
            <Suspense fallback={<Loading/>}>
                {children}
            </Suspense>
        </section>
    );
}