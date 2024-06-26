"use client";
import React, {useEffect, useState} from "react";
import {Post} from "@/types";
import {getPostById} from "@/helpers/post-api";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const postId: number = params.id;
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        async function fetchData() {
            try {
                const postData = await getPostById(postId);
                setPost(postData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [postId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>Название поста: {post?.title}</div>
            <div>Описание поста: {post?.content}</div>
        </main>
    );
}