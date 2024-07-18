"use client";
import React, {useEffect, useState} from "react";
import {Post} from "@/types";
import {getPostById} from "@/helpers/postApi";
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";

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
        username: "",
        createdAt: new Date(),
        categories: []
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const postData = await getPostById(postId);
                postData.content = DOMPurify.sanitize(postData.content);
                setPost(postData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [postId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <Link className="decoration-0" href={`/users/edit/${post.username}`}>
                {post.username}
            </Link>
            <br/>
            <TimeAgo datetime={post.createdAt}/>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.content}}/>
            <div>Категории: {post.categories.map((category) => (
                <span className="category-item" key={category.id}>
                    <Link href={`/categories/${category.id}`}>
                    {category.name}
                    </Link>
                </span>
            ))}</div>
        </main>
    );
}