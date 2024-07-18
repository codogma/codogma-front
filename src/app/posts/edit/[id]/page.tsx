"use client";
import "../../../globals.css"
import {z} from "zod"
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {Category, Post} from "@/types";
import FormInput from "@/components/FormInput";
import {Box, Button, TextField} from "@mui/material";
import {getPostById, updatePost} from "@/helpers/postApi";
import {getCategories} from "@/helpers/categoryApi";
import Autocomplete from "@mui/material/Autocomplete";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {WithAuth} from "@/components/WithAuth";

const PostScheme = z.object({
    categoryIds: z.array(z.number()),
    title: z.optional(z.string().min(2, "Название поста не может содержать менее 2 символов.").max(50, "Название поста не может содержать более 50 символов.")),
    content: z.optional(z.string())
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}


export default function Posts({params}: PageProps) {
    const postId: number = params.id;
    const [post, setPost] = useState<Post>();
    const [categories, setCategories] = useState<Category[]>([]);

    const zodForm = useForm<z.infer<typeof PostScheme>>({
        resolver: zodResolver(PostScheme),
        defaultValues: {
            categoryIds: [],
            title: "",
            content: ""
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const postData = await getPostById(postId);
                setPost(postData);

                const allCategories = await getCategories();
                console.log(allCategories);
                setCategories(allCategories);

                zodForm.reset({
                    categoryIds: postData.categories.map((category) => category.id),
                    title: postData.title,
                    content: postData.content
                });
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [postId, zodForm])

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

    const onSubmit: SubmitHandler<z.infer<typeof PostScheme>> = (formData) => {
        const requestData = {...formData}
        console.log(requestData)
        updatePost(postId, requestData)
    }


    return WithAuth(() =>
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <FormProvider {...zodForm}>
                <Box
                    component="form"
                    noValidate
                    sx={{m: 1, ml: '20ch', mr: '20ch'}}
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
                                defaultValue={post?.categories}
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
                                defaultValue={post?.content}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Button type="submit">Create</Button>
                </Box>
            </FormProvider>
        </main>
    );
}