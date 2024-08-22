"use client";
import React, {useEffect, useState} from "react";
import {Category, UserRole} from "@/types";
import {getCategories} from "@/helpers/categoryApi";
import Link from "next/link";
import {Avatar, Badge, Button} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import {useAuth} from "@/components/AuthProvider";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import NavTabs from "@/components/NavTabs";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([])
    const {state} = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const allCategories = await getCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {categories.map((category) => (
                <Card key={category.id} className="itb-category">
                    <CardContent className="card-content">
                        <div className="category-content">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                badgeContent={
                                    <IconButton component="label" color="inherit" sx={{p: 0}}/>
                                }
                            >
                                <Avatar className="category-img" variant="rounded" src={category.imageUrl}>
                                    <ImageIcon/>
                                </Avatar>
                            </Badge>
                            <ul>
                                <li><Link href={`/categories/${category.id}`}
                                          className="category-name">{category.name}</Link>
                                </li>
                                <li><p className="category-description">{category.description}</p></li>
                                <li>
                                    <div className="category-tags">{category.tags.map((tag) => (
                                        <span className="tag-item" key={tag.id}>
                                        <Link key={tag.id} href={`/tags/${tag.id}`}
                                              className="tag-name">{tag.name}</Link>
                                        </span>
                                    ))}</div>
                                </li>
                            </ul>
                        </div>
                        <CardActions className="p-0 m-0">
                            <Stack direction="row" spacing={2}>
                                {state.user?.role === UserRole.ROLE_ADMIN && (
                                    <Link href={`/categories/edit/${category.id}`}>
                                        <Button className="article-btn" variant="outlined">Update</Button>
                                    </Link>
                                )}
                            </Stack>
                        </CardActions>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}