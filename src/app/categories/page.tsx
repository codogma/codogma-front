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

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([])
    const {state} = useAuth();
    const [imageUrl, setImageUrl] = useState<string>()

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
                    <CardContent>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            badgeContent={
                                <IconButton component="label" color="inherit" sx={{p: 0}}/>
                            }
                            >
                        <Avatar variant="rounded" src={imageUrl} sx={{width: 112, height: 112}}>
                            <ImageIcon/>
                        </Avatar>
                    </Badge>
                    <ul>
                        <li><Link href={`/categories/${category.id}`} className="category-name">{category.name}</Link>
                        </li>
                        <li>{category.description}</li>
                    </ul>
                    <CardActions>
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
)
;
}