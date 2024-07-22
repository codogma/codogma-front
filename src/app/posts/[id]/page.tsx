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
        <main className="mt-10 mb-10">
            <article className="itb-article">
                <div className="article-meta-container">
                    <Link className="article-user-name" href={`/users/edit/${post.username}`}>
                        {post.username}
                    </Link>
                    <TimeAgo datetime={post.createdAt} className="article-datetime"/>
                </div>
                <h1 className="article-title-h1">{post.title}</h1>
                <div className="article-category">{post.categories.map((category) => (
                    <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                    </span>
                ))}
                </div>
                <div className="article-content" dangerouslySetInnerHTML={{__html: post.content}}/>
                <div className="article-presenter-meta">
                    {/*TODO после добавления тегов раскомментировать и подправить*/}
                    {/*<div className="article-category-pm">Теги: {post.categories.map((category) => (*/}
                    {/*    <span className="category-item" key={category.id}>*/}
                    {/*        <Link className="category-link" href={`/categories/${category.id}`}>*/}
                    {/*        {category.name}*/}
                    {/*        </Link>*/}
                    {/*    </span>*/}
                    {/*))}*/}
                    {/*</div>*/}
                    <div className="article-category-pm">Категории: {post.categories.map((category) => (
                        <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                    ))}
                    </div>
                </div>
            </article>
        </main>
    );
}
