"use client";
import React, {useEffect, useState} from "react";
import {Post, User} from "@/types";
import {getPostById} from "@/helpers/post-api";
import Link from "next/link";
import DOMPurify from "dompurify";
import {getUserById} from "@/helpers/user-api";
import TimeAgo from "@/components/TimeAgo";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const postId: number = params.id;
    const [post, setPost] = useState<Post>({
        id: 0,
        title: "",
        content: "",
        userId: 0,
        createdAt: new Date()
    });
    const [user, setUser] = useState<User>();

    useEffect(() => {
        async function fetchData() {
            try {
                const postData = await getPostById(postId);
                postData.content = DOMPurify.sanitize(postData.content);
                setPost(postData);
                const userData = await getUserById(postData.userId);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [postId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <span>
                <Link href={`/users/edit/${user?.id}`}>
                    {user?.username}
                </Link>
                <TimeAgo datetime={post.createdAt}/>
            </span>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.content}}/>
        </main>
    );
}