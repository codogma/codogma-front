"use client";
import "../../../globals.css"
import {z} from "zod"
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {Post} from "@/types";
import FormInput from "@/components/form-input";
import {Box, Button} from "@mui/material";
import {getPostById, updatePost} from "@/helpers/post-api";

const PostScheme = z.object({
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
    // const [genres, setGenres] = useState<Genre[]>([]);
    // const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const zodForm = useForm<z.infer<typeof PostScheme>>({
        resolver: zodResolver(PostScheme),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    const {
        reset,
        handleSubmit,
        register,
        formState: {isSubmitSuccessful, errors}
    } = zodForm

    useEffect(() => {
        async function fetchData() {
            try {
                const postData = await getPostById(postId);
                setPost(postData);

                // const allGenres = await getGenres();
                // setGenres(allGenres);

                zodForm.reset({
                    title: postData.title,
                    content: postData.content
                });
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [postId, zodForm])



    // const handleAddGenre = (item: ListItem) => {
    //     const genre = genres.find(genre => genre.id === item.id);
    //     if (genre) {
    //         setSelectedGenres(prev => [...prev, genre]);
    //     }
    // };
    //
    // const handleRemoveGenre = (genreId: number) => {
    //     setSelectedGenres(prev => prev.filter((genre) => genre.id !== genreId));
    // };
    //
    // const handleRemoveAllGenres = (): void => {
    //     setSelectedGenres([]);
    // };

    // useEffect(() => {
    //     const userIds = selectedUsers.map((user) => user.id);
    //     zodForm.setValue("userIds", userIds)
    // }, [selectedUsers, zodForm])
    //
    // const onSubmit = (formData: z.infer<typeof PostScheme>) => {
    //     // console.log(formData)
    //     updatePost(postId, formData)
    // }

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


    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <FormProvider {...zodForm}>
                <Box
                    component="form"
                    noValidate
                    sx={{
                        m: 1, width: '25ch',
                    }}
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FormInput name="title" label="Title" variant="standard" defaultValue={post?.title}/>
                    <FormInput name="content" label="Content" variant="standard" defaultValue={post?.content}/>
                    <Button type="submit">Update</Button>
                </Box>
            </FormProvider>
        </main>
    );
}
