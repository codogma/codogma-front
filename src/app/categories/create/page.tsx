"use client";
import "../../globals.css"
import {z} from "zod"
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {createCategory} from "@/helpers/categoryApi";
import {Avatar, Badge, Box, Button} from "@mui/material";
import FormInput from "@/components/FormInput";
import {WithAuth} from "@/components/WithAuth";
import IconButton from "@mui/material/IconButton";
import {ModeEditOutlineOutlined} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {Category} from "@/types";

const CategoryScheme = z.object({
    name: z.string().min(2, "Название категории не может содержать менее 2 символов.").max(50, "Название категории не может содержать более 50 символов."),
    image: z.optional(z.instanceof(File)),
    description: z.optional(z.string())
})

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

function Categoties() {
    const [category, setCategory] = useState<Category>();
    const [imageFile, setImageFile] = useState<File>();

    const zodForm = useForm<z.infer<typeof CategoryScheme>>({
        resolver: zodResolver(CategoryScheme),
        defaultValues: {
            name: "",
            image: undefined,
            description: "",
        }
    })

    const {
        reset,
        handleSubmit,
        register,
        formState: {isSubmitSuccessful, errors}
    } = zodForm

    useEffect(() => {
        zodForm.reset({
            name: category?.name,
            image: undefined,
            description: category?.description,
        })
        if (isSubmitSuccessful) {
            reset(zodForm.getValues());
        }
    }, [category?.description, category?.name, isSubmitSuccessful, reset, zodForm]);

    const onSubmit = (formData: z.infer<typeof CategoryScheme>) => {
        const requestData = {...formData, image: imageFile}
        console.log(formData)
        createCategory(requestData)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setCategory(prev => prev ? {...prev, imageUrl: URL.createObjectURL(file)} : prev);
        }
    };


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
                    <FormInput name="name" label="Name" variant="standard"/>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        badgeContent={
                            <IconButton component="label" color="inherit" sx={{p: 0}}>
                                <ModeEditOutlineOutlined color="primary"/>
                                <VisuallyHiddenInput
                                    id="image"
                                    name="image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </IconButton>
                        }
                    >
                        <Avatar className="bg-mountain-mist" variant="rounded" src={category?.imageUrl}
                                sx={{width: 112, height: 112}}/>
                            {/*<AddPhotoAlternateIcon/>*/}
                        {/*</Avatar>*/}
                    </Badge>
                    <FormInput name="description" label="Description" variant="standard"/>
                    <Button type="submit">Create</Button>
                </Box>
            </FormProvider>
        </main>
    );
}

export default WithAuth(Categoties)