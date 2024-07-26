"use client";
import "../../globals.css";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Category} from "@/types";
import {createArticle} from "@/helpers/articleApi";
import {Box, Button, TextField} from "@mui/material";
import FormInput from "@/components/FormInput";
import Autocomplete from "@mui/material/Autocomplete";
import {getCategories} from "@/helpers/categoryApi";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {WithAuth} from "@/components/WithAuth";
import {useRouter} from "next/navigation";

const ArticleScheme = z.object({
    categoryIds: z.array(z.number()),
    title: z.string().min(2, "Название статьи не может содержать менее 2 символов.").max(50, "Название статьи не может содержать более 50 символов."),
    content: z.string()
});

function Articles() {
    const route = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allCategories = await getCategories();
                console.log(allCategories);
                setCategories(allCategories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const zodForm = useForm<z.infer<typeof ArticleScheme>>({
        resolver: zodResolver(ArticleScheme),
        defaultValues: {
            categoryIds: [],
            title: "",
            content: ""
        }
    });

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
    }, [isSubmitSuccessful, reset]);

    const onSubmit: SubmitHandler<z.infer<typeof ArticleScheme>> = (formData) => {
        const requestData = {...formData};
        console.log(requestData);
        createArticle(requestData).then(article => route.push(`/articles/${article.id}`));
    };

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

export default WithAuth(Articles)