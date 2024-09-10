"use client";
import React, {useEffect, useState} from "react";
import {Category, UserRole} from "@/types";
import Link from "next/link";
import {getCategories} from "@/helpers/categoryApi";
import {Badge, Button, Card, CardActions, CardContent, IconButton, Skeleton, Stack} from "@mui/material";
import {useAuth} from "@/components/AuthProvider";
import {AvatarImage} from "@/components/AvatarImage";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const {state} = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const allCategories = await getCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <section>
            {loading ? (
                <Card variant="outlined" className="card">
                    <CardContent className="card-content">
                        <div className="meta-container">
                            <Skeleton variant="rounded" width={48} height={48}/>
                            <ul>
                                <li><Skeleton variant="text" width={100}/></li>
                                <li><Skeleton variant="text" width={150}/></li>
                                <li><Skeleton variant="text" width={150}/></li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                categories.map((category) => (
                    <Card key={category.id} variant="outlined" className="card">
                        <CardContent className="card-content">
                            <div className="meta-container">
                                <Badge
                                    className="items-start"
                                    overlap="circular"
                                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                    badgeContent={
                                        <IconButton component="label" color="inherit" sx={{p: 0}}/>
                                    }
                                >
                                    <AvatarImage
                                        alt={category.name}
                                        className="category-img"
                                        variant="rounded"
                                        src={category.imageUrl}
                                        size={48}
                                    />
                                </Badge>
                                <ul>
                                    <li>
                                        <Link
                                            href={`/categories/${category.id}`}
                                            className="category-name"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                    <li>
                                        <p className="category-description">{category.description}</p>
                                    </li>
                                    <li>
                                        <div className="category-tags">
                                            {category.tags?.map((tag) => (
                                                <span className="tag-item" key={tag.id}>
                          <Link
                              key={tag.id}
                              href={`/tags/${tag.id}`}
                              className="tag-name"
                          >
                            {tag.name}
                          </Link>
                        </span>
                                            ))}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <CardActions className="p-0 m-0">
                                <Stack direction="row" spacing={2}>
                                    {state.user?.role === UserRole.ROLE_ADMIN && (
                                        <Link href={`/categories/edit/${category.id}`}>
                                            <Button className="article-btn" variant="outlined">
                                                Update
                                            </Button>
                                        </Link>
                                    )}
                                </Stack>
                            </CardActions>
                        </CardContent>
                    </Card>
                ))
            )}
        </section>
    );
}
