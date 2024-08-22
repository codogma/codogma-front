"use client";
import "../../../globals.css"
import {z} from "zod"
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {MouseEvent, useEffect, useState} from "react";
import {Article, Category, Tag} from "@/types";
import FormInput from "@/components/FormInput";
import {Box, Button, Chip, TextField} from "@mui/material";
import {deleteArticle, getArticleById, updateArticle} from "@/helpers/articleApi";
import {getCategories} from "@/helpers/categoryApi";
import Autocomplete from "@mui/material/Autocomplete";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {WithAcc} from "@/components/WithAcc";
import {getTagsByName} from "@/helpers/tagApi";

const ArticleScheme = z.object({
    categoryIds: z.array(z.number()),
    title: z.optional(z.string().min(2, "Название статьи не может содержать менее 2 символов.").max(50, "Название статьи не может содержать более 50 символов.")),
    content: z.optional(z.string()),
    tags: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional()
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
    const [categories, setCategories] = useState<Category[]>([])
    const [inputTagValue, setInputTagValue] = useState<string>('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const zodForm = useForm<z.infer<typeof ArticleScheme>>({
        resolver: zodResolver(ArticleScheme),
        defaultValues: {
            categoryIds: [],
            title: "",
            content: "",
            tags: [],
            images: []
        }
    });

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
                    content: articleData.content,
                    tags: articleData.tags.map(tag => tag.name),
                    images: []
                });
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [articleId, zodForm])

    useEffect(() => {
        if (inputTagValue === '') {
            setAvailableTags([]);
            return;
        }

        const fetchTags = async () => {
            try {
                const tagObjects: Tag[] = await getTagsByName(inputTagValue);
                const tagNames = tagObjects.map(tag => tag.name);
                setAvailableTags(tagNames);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, [inputTagValue]);

    const {
        reset,
        handleSubmit,
        control,
        formState: {isSubmitSuccessful, errors}
    } = zodForm;

    useEffect(() => {
        // console.log(errors)
        if (isSubmitSuccessful) {
            reset(zodForm.getValues());
        }
    }, [isSubmitSuccessful, reset, zodForm]);


    const onSubmit: SubmitHandler<z.infer<typeof ArticleScheme>> = (formData) => {
        const requestData = {...formData}
        console.log(requestData)
        updateArticle(articleId, requestData).then(() => router.push(`/articles/${articleId}`))
    }

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const articleId = Number(event.currentTarget.id)
        deleteArticle(articleId)
        router.push("/articles")
    }

    return (
        <main className="mt-10 mb-10">
            <Link href={`/articles/${articleId}`}>
                <Button className="article-btn" variant="outlined">Back to article</Button>
            </Link>
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
                    <Controller
                        name="tags"
                        control={control}
                        render={({field}) => (
                            <Autocomplete
                                multiple
                                id="tags"
                                options={availableTags.filter(tag =>
                                    !field.value?.some(value => value.toLowerCase() === tag.toLowerCase())
                                )}
                                defaultValue={article?.tags.map(tag => tag.name)}
                                freeSolo
                                value={field.value}
                                onChange={(_, newValue) => {
                                    const normalizedValue = newValue.map(value => {
                                        const existingTag = availableTags.find(tag => tag.toLowerCase() === value.toLowerCase());
                                        return existingTag || value;
                                    });

                                    const uniqueTags = new Set<string>();
                                    normalizedValue.forEach(tag => {
                                        uniqueTags.add(tag);
                                    });

                                    field.onChange(Array.from(uniqueTags));
                                }}
                                onInputChange={(_, newInputValue) => setInputTagValue(newInputValue)}
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option: string, index: number) => {
                                        const {key, ...tagProps} = getTagProps({index});
                                        return (
                                            <Chip variant="outlined" label={option} key={key} {...tagProps} />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Tags"
                                        placeholder="Select or create tags"
                                    />
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
                        <Button id={articleId.toString()} style={{color: "red"}}
                                onClick={handleDelete}>Delete</Button>
                    </div>
                </Box>
            </FormProvider>
        </main>
    );
}

export default WithAcc(Articles);
