"use client";
import React, {useEffect, useState} from "react";
import {getPosts} from "@/helpers/postApi";
import {Post} from "@/types";
import {Button} from "@mui/material";
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allPosts = await getPosts();
                allPosts.map((post) => post.content = DOMPurify.sanitize(post.content));
                setPosts(allPosts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData().then()
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            {posts?.map((post) => (
                <ul key={post.title}>
                    <li>Автор поста: <Link href={`/users/${post.username}`}>{post.username}</Link></li>
                    <TimeAgo datetime={post.createdAt}/>
                    <li>Название поста: <Link href={`/posts/${post.id}`}>{post.title}</Link></li>
                    <div>{post.categories.map((category) => (
                        <span className="category-item" key={category.id}>
                            {category.name}
                        </span>
                    ))}</div>
                    <div dangerouslySetInnerHTML={{__html: post.content}}/>
                    <Link href={`/posts/edit/${post.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                </ul>
            ))}
        </main>
    );
}