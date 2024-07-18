"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {Category} from "@/types";
import {deleteCategory, getCategories} from "@/helpers/categoryApi";
import Link from "next/link";
import {Button} from "@mui/material";

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

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const categoryId = Number(event.currentTarget.id)
        setCategories(categories.filter((category) => category.id !== categoryId))
        deleteCategory(categoryId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {categories.map((category) => (
                <ul key={category.id}>
                    <li>Название категории: <Link href={`/categories/${category.id}`}>{category.name}</Link></li>
                    <li>Посты категории:</li>
                    {category.posts?.map((post) => (
                        <ul key={`/posts/${post.id}`}>
                            <li><Link href={`/posts/${post.id}`}>{post.title}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/categories/edit/${category.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                    <Link href={"/categories"}>
                        <Button id={category.id.toString()} onClick={handleDelete}>Удалить категорию</Button>
                    </Link>
                </ul>
            ))}
        </main>
    );
}
