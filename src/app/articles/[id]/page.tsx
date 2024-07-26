"use client";
import React, {useEffect, useState} from "react";
import {Article, UserRole} from "@/types";
import {getArticleById} from "@/helpers/articleApi";
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";
import {Button} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {useAuth} from "@/components/AuthProvider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const articleId: number = params.id;
    const {state} = useAuth();
    const [article, setArticle] = useState<Article>({
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
                const articleData = await getArticleById(articleId);
                articleData.content = DOMPurify.sanitize(articleData.content);
                setArticle(articleData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [articleId])

    return (
        <>
            <Card className="itb-article">
                <CardContent>
                    <div className="article-meta-container">
                        <Link className="article-user-name" href={`/users/edit/${article.username}`}>
                            {article.username}
                        </Link>
                        <TimeAgo datetime={article.createdAt} className="article-datetime"/>
                    </div>
                    <h1 className="article-title-h1">{article.title}</h1>
                    <div className="article-category">{article.categories.map((category) => (
                        <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                    </span>
                    ))}
                    </div>
                    <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}}/>
                    <div className="article-presenter-meta">
                        {/*TODO после добавления тегов раскомментировать и подправить*/}
                        {/*<div className="article-category-pm">Теги: {article.categories.map((category) => (*/}
                        {/*    <span className="category-item" key={category.id}>*/}
                        {/*        <Link className="category-link" href={`/categories/${category.id}`}>*/}
                        {/*        {category.name}*/}
                        {/*        </Link>*/}
                        {/*    </span>*/}
                        {/*))}*/}
                        {/*</div>*/}
                        <div className="article-category-pm">Категории: {article.categories.map((category) => (
                            <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                        ))}
                        </div>
                    </div>
                    {state.user?.username === article.username && state.user.role === UserRole.ROLE_AUTHOR && (
                        <Link href={`/articles/edit/${article.id}`}>
                            <Button className="article-btn" variant="outlined" startIcon={<EditOutlinedIcon/>}>
                                Edit
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
