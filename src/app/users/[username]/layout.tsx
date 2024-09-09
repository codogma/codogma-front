"use client";
import React, {Suspense, useEffect, useState} from 'react';
import {User} from "@/types";
import NavTabs, {LinkTabProps} from "@/components/NavTabs";
import CardContent from "@mui/material/CardContent";
import {Badge} from "@mui/material";
import Card from "@mui/material/Card";
import Loading from "@/app/loading";
import {checkSubscription, getUserByUsername, subscribeToUser, unsubscribeToUser,} from "@/helpers/userApi";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import {useAuth} from "@/components/AuthProvider";
import {AvatarImage} from "@/components/AvatarImage";

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
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const {state} = useAuth();

    const tabs: LinkTabProps[] = [
        {label: 'Profile', href: `/users/${username}/profile`},
        {label: 'Articles', href: `/users/${username}/articles`},
        {label: 'Subscribers', href: `/users/${username}/subscribers`},
        {label: 'Subscriptions', href: `/users/${username}/subscriptions`},
        {label: 'Comments', href: `/users/${username}/comments`},
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

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


    return (
        <section>
            <Card variant="outlined" className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <Badge
                            className="items-start"
                            overlap="circular"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={<IconButton component="label" color="inherit" sx={{p: 0}}/>}
                        >
                            <AvatarImage alt={user?.username} className="category-img" variant="rounded"
                                         src={user?.avatarUrl} size={24}/>
                        </Badge>
                        <Typography
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}
                        >
                            <div>
                                {isSubscribed ? (
                                    <button className="article-btn" onClick={handleUnsubscribe}>Following</button>
                                ) : (
                                    <button className="article-btn" onClick={handleSubscribe}>Follow</button>
                                )}
                            </div>
                        </Typography>
                        <Popover
                            id="mouse-over-popover"
                            sx={{pointerEvents: 'none'}}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            {!state.isAuthenticated && <Typography sx={{p: 1}}>Log in</Typography>}
                        </Popover>
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