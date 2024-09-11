"use client";
import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {getCategories} from "@/helpers/categoryApi";
import Categories from "@/components/Categories";

export default function Page() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

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
        <>
            <Categories categories={categories} loading={loading}/>
        </>
    );
}
