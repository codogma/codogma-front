"use client";
import "../../../globals.css"
import {z} from "zod"
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {User} from "@/types"
import FormInput from "@/components/form-input";
import {Box, Button} from "@mui/material";
import {getUserById, updateUser} from "@/helpers/user-api";

const UserScheme = z.object({
    username: z.optional(z.string().min(2, "Название автора не может содержать менее 2 символов.").max(50, "Название автора не может содержать более 50 символов."))
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Users({params}: PageProps) {
    const userId: number = params.id
    const [user, setUser] = useState<User>();

    const zodForm = useForm<z.infer<typeof UserScheme>>({
        resolver: zodResolver(UserScheme),
        defaultValues: {
            username: ""
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
                const userData = await getUserById(userId);
                setUser(userData);

                zodForm.reset({
                    username: userData.username
                });
            } catch (error) {
                console.error("Error fetching data: " + error);
            }
        }

        fetchData();
    }, [userId, zodForm]);


    if (!user) {
        return <div>Loading...</div>;
    }

    const onSubmit: SubmitHandler<z.infer<typeof UserScheme>> = (formData) => {
        console.log(formData)
        updateUser(userId, formData)
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
                    <FormInput name="username" label="Username" variant="standard" defaultValue={user?.username}/>
                    <Button type="submit">Update</Button>
                </Box>
            </FormProvider>
        </main>
    );
}
