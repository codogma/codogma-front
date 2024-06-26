"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {User} from "@/types";
import {deleteUser, getUsers} from "@/helpers/user-api";
import Link from "next/link";
import {Button} from "@mui/material";

export default function Page() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const allUsers = await getUsers();
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const userId = Number(event.currentTarget.id)
        setUsers(users.filter((user) => user.id !== userId))
        deleteUser(userId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {users?.map((user) => (
                <ul key={user.id}>
                    <li>Имя автора: <Link href={`/users/${user.id}`}>{user.username}</Link></li>
                    <li>Книги автора:</li>
                    {user.posts?.map((post) => (
                        <ul key={`/posts/${post.id}`}>
                            <li><Link href={`/posts/${post.id}`}>{post.title}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/users/edit/${user.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                    <Link href={`/users`}>
                        <Button id={user.id.toString()} onClick={handleDelete}>Удалить автора</Button>
                    </Link>
                </ul>
            ))}
        </main>
    );
}
