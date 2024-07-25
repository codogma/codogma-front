"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {Category, UserRole} from "@/types";
import {getCategories} from "@/helpers/categoryApi";
import Link from "next/link";
import {Button} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";
import {state} from "sucrase/dist/types/parser/traverser/base";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([])

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
                        <Link href={`/categories/${category.id}`} className="category-name">{category.name}</Link>
                        <CardActions>
                            <Stack direction="row" spacing={2}>
                                <Link href={`/categories/edit/${category.id}`}>
                                    <Button className="article-btn" variant="outlined">Update</Button>
                                </Link>
                            </Stack>
                        </CardActions>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}