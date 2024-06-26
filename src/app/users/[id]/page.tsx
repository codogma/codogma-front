"use client";
import {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserById} from "@/helpers/user-api";
import Link from "next/link";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const userId: number = params.id;
    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserById(userId);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [userId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>{user?.username}</div>
            {user?.posts?.map((post) => (
                <ul key={post.id}>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    <li>{post.content}</li>
                </ul>
            ))}
        </main>
    );
}