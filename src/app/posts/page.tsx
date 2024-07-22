"use client";
import React, {useEffect, useState} from "react";
import {getPosts} from "@/helpers/postApi";
import {Post} from "@/types";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";
import {Avatar, Button} from "@mui/material";
import Stack from '@mui/material/Stack';

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
        <>
            {posts?.map((post) => (
                <article key={post.title} className="itb-article">
                    <div className="article-meta-container">
                        <Avatar className="article-user-avatar" {...stringAvatar(post.username)} variant="rounded"/>
                        <Link href={`/users/${post.username}`}
                              className="article-user-name">{post.username}</Link>
                        <TimeAgo datetime={post.createdAt} className="article-datetime"/>
                    </div>
                    <Link href={`/posts/${post.id}`} className="article-title">{post.title}</Link>
                    <div className="article-category">{post.categories.map((category) => (
                        <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                    ))}</div>
                    <div className="article-content" dangerouslySetInnerHTML={{__html: post.content}}/>
                    <Stack direction="row" spacing={2}>
                        <Link href={`/posts/${post.id}`}>
                            <Button className="article-btn" variant="outlined">Read More</Button>
                        </Link>
                        <Link href={`/posts/edit/${post.id}`}>
                            <Button className="article-btn" variant="outlined" startIcon={<EditOutlinedIcon/>}>
                                Edit
                            </Button>
                        </Link>
                    </Stack>
                </article>
            ))}
        </>
    );
}