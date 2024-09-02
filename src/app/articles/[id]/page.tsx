"use client";
import React, {useEffect, useState} from "react";
import {Article, UserRole} from "@/types";
import {getArticleById} from "@/helpers/articleApi";
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";
import {Avatar, Button} from "@mui/material";
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

export default function Page({params}: PageProps) {
    const articleId: number = params.id;
    const {state} = useAuth();
    const [article, setArticle] = useState<Article>({
        id: 0,
        title: "",
        content: "",
        previewContent: "",
        username: "",
        authorAvatarUrl: "",
        createdAt: new Date(),
        categories: [],
        tags: []
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
            <Card key={article.id} className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <Avatar
                            className="article-user-avatar"
                            src={article.authorAvatarUrl}
                            {...(article.authorAvatarUrl.length !== 0 ? stringAvatar(article.username) : {})}
                            variant="rounded"
                        />
                        <Link className="article-user-name" href={`/users/edit/${article.username}`}>
                            {article.username}
                        </Link>
                        <TimeAgo datetime={article.createdAt} className="article-datetime"/>
                    </div>
                    <h1 className="article-title">{article.title}</h1>
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
                        <div className="article-category-pm">Категории: {article.categories.map((category) => (
                            <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                        ))}
                        </div>
                        <div className="article-tag-pm">Теги: {article.tags.map((tag) => (
                            <span className="tag-item" key={tag.id}>
                            <Link className="tag-link" href={`/categories/${tag.id}`}>
                            {tag.name}
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
