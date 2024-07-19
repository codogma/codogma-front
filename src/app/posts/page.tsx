"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {deletePost, getPosts} from "@/helpers/postApi";
import {Post} from "@/types";
import {Button} from "@mui/material";
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";
import {WithAuth} from "@/components/WithAuth";

function Page() {
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

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const postId = Number(event.currentTarget.id)
        setPosts(posts.filter((post) => post.id !== postId))
        deletePost(postId)
    }


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
                    <Link href={"/posts"}>
                        <Button id={post.id.toString()} onClick={handleDelete}>Удалить пост</Button>
                    </Link>
                </ul>
            ))}
        </main>
    );
}

export default WithAuth(Page)
