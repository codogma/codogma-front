"use client";
import "../../../globals.css"
import {z} from "zod"
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {MouseEvent, useEffect, useState} from "react";
import {Category, Article} from "@/types";
import FormInput from "@/components/FormInput";
import {Box, Button, TextField} from "@mui/material";
import {deleteArticle, getArticleById, updateArticle} from "@/helpers/articleApi";
import {getCategories} from "@/helpers/categoryApi";
import Autocomplete from "@mui/material/Autocomplete";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {WithAuth} from "@/components/WithAuth";
import {useRouter} from "next/navigation";

const ArticleScheme = z.object({
    categoryIds: z.array(z.number()),
    title: z.optional(z.string().min(2, "Название статьи не может содержать менее 2 символов.").max(50, "Название статьи не может содержать более 50 символов.")),
    content: z.optional(z.string())
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}


function Articles({params}: PageProps) {
    const router = useRouter();
    const articleId: number = params.id;
    const [article, setArticle] = useState<Article>();
    const [categories, setCategories] = useState<Category[]>([]);

    const zodForm = useForm<z.infer<typeof ArticleScheme>>({
        resolver: zodResolver(ArticleScheme),
        defaultValues: {
            categoryIds: [],
            title: "",
            content: ""
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const articleData = await getArticleById(articleId);
                setArticle(articleData);

                const allCategories = await getCategories();
                console.log(allCategories);
                setCategories(allCategories);

                zodForm.reset({
                    categoryIds: articleData.categories.map((category) => category.id),
                    title: articleData.title,
                    content: articleData.content
                });
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [articleId, zodForm])

    const {
        reset,
        handleSubmit,
        control,
        formState: {isSubmitSuccessful, errors}
    } = zodForm;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset])

    const onSubmit: SubmitHandler<z.infer<typeof ArticleScheme>> = (formData) => {
        const requestData = {...formData}
        console.log(requestData)
        updateArticle(articleId, requestData)
        router.push(`/articles/${articleId}`)
    }

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const articleId = Number(event.currentTarget.id)
        deleteArticle(articleId)
        router.push("/articles")
    }

    return (
        <main className="mt-10 mb-10">
            <FormProvider {...zodForm}>
                <Box
                    component="form"
                    noValidate
                    // sx={{m: 1, ml: '20ch', mr: '20ch'}}
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="categoryIds"
                        control={control}
                        render={({field}) => (
                            <Autocomplete
                                multiple
                                id="categories"
                                options={categories}
                                defaultValue={article?.categories}
                                getOptionLabel={(category) => category?.name}
                                filterSelectedOptions
                                value={categories.filter(category => field.value.includes(category.id))}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(_, newValue) => field.onChange(newValue.map(category => category.id))}
                                renderInput={(params) => (
                                    <TextField {...params} label="Categories" variant="standard"
                                               placeholder="Select categories"/>
                                )}
                            />
                        )}
                    />
                    <FormInput name="title" label="Title" variant="standard"/>
                    <Controller
                        name="content"
                        control={control}
                        render={({field}) => (
                            <TinyMCEEditor
                                defaultValue={article?.content}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <div className="flex justify-between w-full">
                        <Button type="submit">Update</Button>
                        <Button id={articleId.toString()} style={{color: "red"}} onClick={handleDelete}>Delete</Button>
                    </div>
                </Box>
            </FormProvider>
        </main>
    );
}

export default WithAuth(Articles)