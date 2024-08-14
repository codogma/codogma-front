"use client";
import "../../globals.css";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Category, Tag} from "@/types";
import {createArticle} from "@/helpers/articleApi";
import {Box, Button, TextField} from "@mui/material";
import FormInput from "@/components/FormInput";
import Autocomplete from "@mui/material/Autocomplete";
import {getCategories} from "@/helpers/categoryApi";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {WithAuth} from "@/components/WithAuth";
import {useRouter} from "next/navigation";
import {createTag, getTagsByName} from "@/helpers/tagApi";

const ArticleScheme = z.object({
    categoryIds: z.array(z.number()),
    title: z.string().min(2, "Название статьи не может содержать менее 2 символов.").max(50, "Название статьи не может содержать более 50 символов."),
    content: z.string(),
    tagIds: z.array(z.number()),
    images: z.array(z.instanceof(File)).optional()
});

function Articles() {
    const route = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

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
            content: "",
            tagIds: [],
            images: []
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

    const handleTagInputChange = async (event: React.SyntheticEvent, value: string) => {
        setInputValue(value);
        if (value.length > 0) {
            try {
                const fetchedTags = await getTagsByName(value);
                setTags(fetchedTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        }
    };

    const handleTagChange = async (event: React.SyntheticEvent, newValue: Tag[]) => {
        const selectedTagIds = newValue.map(tag => tag.id);
        const newTags = newValue.filter(tag => !tags.some(t => t.id === tag.id));

        if (newTags.length > 0) {
            try {
                for (const tag of newTags) {
                    const createdTag = await createTag({name: tag.name});
                    setTags(prevTags => [...prevTags, createdTag]);
                }
            } catch (error) {
                console.error('Error creating tag:', error);
            }
        }

        zodForm.setValue("tagIds", selectedTagIds);
    };

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
                    <Controller
                        name="tagIds"
                        control={control}
                        render={({field}) => (
                            <Autocomplete
                                multiple
                                id="tags"
                                options={tags}
                                getOptionLabel={(tag) => tag?.name || ""}
                                filterSelectedOptions
                                inputValue={inputValue}
                                onInputChange={handleTagInputChange}
                                value={tags.filter(tag => field.value?.includes(tag.id) || false)}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={handleTagChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tags" variant="standard"
                                               placeholder="Select or add tags"/>
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