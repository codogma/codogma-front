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
        <main className="pt-4 pb-4 pl-5 pr-5">
            {posts?.map((post) => (
                <article key={post.title} className="">
                    <Link href={`/users/${post.username}`}>{post.username}</Link>
                    <TimeAgo datetime={post.createdAt}/>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    <div>{post.categories.map((category) => (
                        <span className="category-item" key={category.id}>
                            {category.name}
                        </span>
                    ))}</div>
                    <div dangerouslySetInnerHTML={{__html: post.content}}/>
                    <Link href={`/posts/edit/${post.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                </article>
            ))}
        </main>
    );
}