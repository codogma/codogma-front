"use client";
import React, {useEffect, useState} from "react";
import {Category, Tag, User} from "@/types";
import {getAuthors} from "@/helpers/userApi";
import Link from "next/link";
import {getCategories} from "@/helpers/categoryApi";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Avatar} from "@mui/material";

const tempTags: Tag[] = [
    {id: 1, name: "Бизнес-модели"},
    {id: 2, name: "Развитие стартапа"},
    {id: 3, name: "Лайфхаки для гиков"},
    {id: 4, name: "Управление персоналом"},
    {id: 5, name: "Научно-популярное"},
    {id: 6, name: "Бизнес-модели"},
    {id: 7, name: "Развитие стартапа"},
    {id: 8, name: "Лайфхаки для гиков"},
    {id: 9, name: "Управление персоналом"},
    {id: 10, name: "Научно-популярное"}
]

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

function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [tags, setTags] = useState<Tag[]>(tempTags);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allUsers = await getAuthors()
                console.log(allUsers)
                const allCategories = await getCategories();
                setCategories(allCategories);
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {users && users?.map((user) => (
                <Card key={user.username} className="itb-author">
                    <CardContent>
                        <ul key={user.username}>
                            <li>
                                <Avatar
                                    className="article-user-avatar"
                                    src={user.avatarUrl}
                                    {...(user.avatarUrl.length !== 0 ? stringAvatar(user.username) : {})}
                                    variant="rounded"
                                /></li>
                            <li><Link
                                href={`/users/${user.firstName}${user.lastName}`}>{user.firstName} {user.lastName} @{user.username}</Link>
                            </li>
                            <li>О себе: {user.bio}</li>
                            <li>Пишет в категориях:
                                <div className="article-category">{categories.map((category) => (
                                    <div key={category.id} className="itb-category">
                                        <div className="category-tags">{tags.map((tag) => (
                                            <span className="tag-item" key={category.id}>
                                        <Link key={tag.id} href={`/tags/${tag.id}`}
                                              className="tag-name">{tag.name}</Link>
                                        </span>
                                        ))}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}


export default Page
