"use client";
import "../../globals.css"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import React, {useEffect, useState} from "react";
// import {DropdownCombobox, ListItem} from "@/components/dropdown-combobox";
import {User} from "@/types";
import {createPost} from "@/helpers/post-api";
import {Box, Button} from "@mui/material";
import FormInput from "@/components/form-input";
// import {getAuthors} from "@/helpers/user-api";
// import {getGenres} from "@/helpers/genre-api";

const PostScheme = z.object({
    title: z.string().min(2, "Название поста не может содержать менее 2 символов.").max(50, "Название поста не может содержать более 50 символов."),
    content: z.string()
})

export default function Posts() {
    // const [genres, setGenres] = useState<Genre[]>([]);
    // const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const allAuthors = await getAuthors();
    //             // const allGenres = await getGenres();
    //             setUsers(allAuthors);
    //             // setGenres(allGenres)
    //         } catch (error) {
    //             console.error('Error fetching data:', error)
    //         }
    //     }
    //
    //     fetchData()
    // }, [])

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

    // const handleAddGenre = (item: ListItem) => {
    //     setSelectedGenres([...selectedGenres, {id: item.id, name: item.value, books: []}]);
    // };
    //
    // const handleRemoveGenre = (genreId: number) => {
    //     setSelectedGenres(selectedGenres.filter((genre) => genre.id !== genreId));
    // };
    //
    // const handleRemoveAllGenres = (): void => {
    //     setSelectedGenres([]);
    // };


    useEffect(() => {
        if(isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset])

    const onSubmit: SubmitHandler<z.infer<typeof PostScheme>> = (formData) => {
        const requestData = {...formData}
        console.log(requestData)
        createPost(requestData)
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
                    <FormInput name="title" label="Title" variant="standard" />
                    <FormInput name="content" label="Content" variant="standard" />
                    <Button type="submit">Create</Button>
                </Box>
            </FormProvider>
        </main>
    );
}
