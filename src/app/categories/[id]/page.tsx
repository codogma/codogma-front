"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {Category} from "@/types";
import {deleteCategory, getCategories, getCategoryById} from "@/helpers/categoryApi";
import Link from "next/link";
import {Button} from "@mui/material";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const categoryId: number = params.id;
    const [category, setCategory] = useState<Category>();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const genreData = await getCategoryById(categoryId);
                setCategory(genreData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [categoryId])

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

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const categoryId = Number(event.currentTarget.id)
        setCategories(categories.filter((category) => category.id !== categoryId))
        deleteCategory(categoryId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>{category?.name}</div>
            {category?.articles?.map((article) => (
                <ul key={article.id}>
                    <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </ul>
            ))}
            <Link href={"/categories"}>
                <Button id={category?.id?.toString()} className="article-btn" variant="outlined" onClick={handleDelete}>Delete category</Button>
            </Link>
        </main>
    );
}