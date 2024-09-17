"use client";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Category, Tag} from "@/types";
import {Autocomplete, Box, Button, Chip, TextField} from "@mui/material";
import FormInput from "@/components/FormInput";
import {getCategories} from "@/helpers/categoryApi";
import {TinyMCEEditor} from "@/components/TinyMCEEditor";
import {WithAuth} from "@/components/WithAuth";
import {useRouter} from "next/navigation";
import {getTagsByName} from "@/helpers/tagApi";
import {createArticle} from "@/helpers/articleApi";
import Typography from "@mui/material/Typography";

const ArticleScheme = z.object({
    categoryIds: z.array(z.number()).min(1, "Выберите хотя бы одну категорию."),
    title: z.string().min(2, "Название статьи не может содержать менее 2 символов.").max(300, "Название статьи не может содержать более 300 символов."),
    previewContent: z.string().min(1, "Краткое описание не может быть пустым."),
    content: z.string().min(1, "Основная статья не может быть пустой."),
    tags: z.array(z.string()).optional()
});

function Articles() {
    const route = useRouter();
    const [categories, setCategories] = useState<Category[]>([])
    const [inputTagValue, setInputTagValue] = useState<string>('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allCategories = await getCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

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

    const zodForm = useForm<z.infer<typeof ArticleScheme>>({
        resolver: zodResolver(ArticleScheme),
        defaultValues: {
            categoryIds: [],
            title: "",
            previewContent: "",
            content: "",
            tags: []
        }
    });

    const {
        reset,
        handleSubmit,
        control,
        formState: {isSubmitSuccessful, errors}
    } = zodForm;

    useEffect(() => {
        console.log(errors)
        if (isSubmitSuccessful) {
            reset(zodForm.getValues());
        }
    }, [isSubmitSuccessful, reset, errors, zodForm]);

    const onSubmit: SubmitHandler<z.infer<typeof ArticleScheme>> = (formData) => {
        // console.log(formData);
        createArticle(formData).then(article => route.push(`/articles/${article.id}`));
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
                                               placeholder="Select categories"
                                               error={Boolean(errors.categoryIds?.message)}
                                               helperText={errors.categoryIds?.message}/>
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
                    <Typography className="mb-4 mt-4">Краткое описание:</Typography>
                    {errors.previewContent?.message && (
                        <Typography variant="body2" color="error" className="error-text">
                            {errors.previewContent?.message}
                        </Typography>
                    )}
                    <Controller
                        name="previewContent"
                        control={control}
                        render={({field}) => (
                            <TinyMCEEditor
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Typography className="mb-4 mt-4">Основная статья:</Typography>
                    {errors.content?.message && (
                        <Typography variant="body2" color="error" className="error-text">
                            {errors.content?.message}
                        </Typography>
                    )}
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