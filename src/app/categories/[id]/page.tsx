"use client";
import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {getCategoryById} from "@/helpers/categoryApi";
import {Avatar, Badge} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import NavTabs, {LinkTabProps} from "@/components/NavTabs";
import {usePathname} from "next/navigation";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps, {
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const categoryId: number = params.id;
    const [category, setCategory] = useState<Category>({} as Category);

    const tabs: LinkTabProps[] = [
        {label: 'Articles', href: `${pathname}/articles`},
        {label: 'Authors', href: `${pathname}/users`},
    ]

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


    return (
        <>
            <Card className="card">
                <CardContent className="card-content">
                    <div className="meta-container">
                        <Badge className="items-start"
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
                        <div>
                            <h1 className="category-card-name">{category.name}</h1>
                            <p className="category-card-description">{category.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <NavTabs tabs={tabs} shouldShow/>
            {children}
        </>
    );
}