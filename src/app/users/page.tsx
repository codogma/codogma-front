"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getAuthors} from "@/helpers/userApi";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {AvatarImage} from "@/components/AvatarImage";
import {Skeleton} from "@mui/material";


function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const allUsers = await getAuthors();
                console.log(allUsers)
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false);
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {loading ? (
                <Card variant="outlined" className="itb-user">
                    <CardContent>
                        <div className="user-meta-container">
                            <Skeleton variant="rounded" width={24} height={24}/>
                        </div>
                        <div><Skeleton variant="text" width={100}/></div>
                        <div><Skeleton variant="text" width={100}/></div>
                        <div><Skeleton variant="text" width={150}/></div>
                    </CardContent>
                </Card>
            ) : (
                users && users?.map((user) => (
                    <Card key={user.username} variant="outlined" className="itb-user">
                        <CardContent>
                            <div className="user-meta-container">
                                <AvatarImage
                                    alt={user.username}
                                    className="user-avatar"
                                    src={user.avatarUrl}
                                    variant="rounded"
                                    size={24}
                                />
                            </div>
                            <Link
                                href={`/users/${user.username}`}
                                className="user-title">{user.username}</Link>
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
                ))
            )}
        </>
    );
}

export default Page;
