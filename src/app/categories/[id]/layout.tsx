"use client";
import React, {Suspense, useEffect, useState} from 'react';
import {Category} from "@/types";
import NavTabs, {LinkTabProps} from "@/components/NavTabs";
import {getCategoryById} from "@/helpers/categoryApi";
import CardContent from "@mui/material/CardContent";
import {Avatar, Badge} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import Card from "@mui/material/Card";
import Loading from "@/app/loading";

type PageParams = {
    id: number;
};

type PageProps = {
    params: PageParams;
    children: React.ReactNode;
};

export default function Layout({params, children}: PageProps) {
    const categoryId = params.id;
    const [category, setCategory] = useState<Category>({} as Category);

    const tabs: LinkTabProps[] = [
        {label: 'Articles', href: `/categories/${categoryId}/articles`},
        {label: 'Authors', href: `/categories/${categoryId}/authors`},
    ];

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
    }, [categoryId]);

    return (
        <section>
            <Card className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <Badge
                            className="items-start"
                            overlap="circular"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={<IconButton component="label" color="inherit" sx={{p: 0}}/>}
                        >
                            <Avatar className="category-img" variant="rounded" src={category.imageUrl}>
                                <ImageIcon/>
                            </Avatar>
                        </Badge>
                        <div>
                            <h1 className="category-card-name">{category.name}</h1>
                            <p className="category-card-description">{category.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <NavTabs tabs={tabs}/>
            <Suspense fallback={<Loading/>}>
                {children}
            </Suspense>
        </section>
    );
}