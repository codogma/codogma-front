"use client";
import React, {useEffect, useState} from "react";
import {getArticles} from "@/helpers/articleApi";
import {Article, UserRole} from "@/types";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Link from "next/link";
import DOMPurify from "dompurify";
import {TimeAgo} from "@/components/TimeAgo";
import {Avatar, Button} from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import {useAuth} from "@/components/AuthProvider";

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
    const [articles, setArticles] = useState<Article[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const {state} = useAuth();

    useEffect(() => {
        async function fetchData(page: number) {
            try {
                const {content, totalPages} = await getArticles(undefined, page);
                content.map((article) => article.content = DOMPurify.sanitize(article.content));
                setArticles(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData(currentPage).then()
    }, [currentPage])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    return (
        <>
            {articles?.map((article) => (
                <Card key={article.id} className="itb-article">
                    <CardContent>
                        <div className="article-meta-container">
                            <Avatar
                                className="article-user-avatar"
                                src={article.authorAvatarUrl}
                                {...(article.authorAvatarUrl.length !== 0 ? stringAvatar(article.username) : {})}
                                variant="rounded"
                            />
                            <Link href={`/users/${article.username}`}
                                  className="article-user-name">{article.username}</Link>
                            <TimeAgo datetime={article.createdAt} className="article-datetime"/>
                        </div>
                        <Link href={`/articles/${article.id}`} className="article-title">{article.title}</Link>
                        <div className="article-category">{article.categories.map((category) => (
                            <span className="category-item" key={category.id}>
                            <Link className="category-link" href={`/categories/${category.id}`}>
                            {category.name}
                            </Link>
                        </span>
                        ))}</div>
                        <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}}/>
                    </CardContent>
                    <CardActions>
                        <Stack direction="row" spacing={2}>
                            <Link href={`/articles/${article.id}`}>
                                <Button className="article-btn" variant="outlined">Read More</Button>
                            </Link>
                            {state.user?.username === article.username && state.user.role === UserRole.ROLE_AUTHOR && (
                                <Link href={`/articles/edit/${article.id}`}>
                                    <Button className="article-btn" variant="outlined" startIcon={<EditOutlinedIcon/>}>
                                        Edit
                                    </Button>
                                </Link>
                            )}
                        </Stack>
                    </CardActions>
                </Card>
            ))}
            <Stack spacing={2}>
                <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} variant="outlined"
                            shape="rounded"/>
            </Stack>
        </>
    );
}