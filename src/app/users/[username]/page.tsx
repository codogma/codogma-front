"use client";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {getUserByUsername, updateUser, UserUpdate} from "@/helpers/userApi";
import {Avatar, Box, Button} from "@mui/material";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";

type PageParams = {
    username: string
}

type PageProps = {
    params: PageParams
}

const UserScheme = z.object({
    username: z.optional(z.string()
        .min(2, "Имя пользователя не может содержать менее 2 символов.")
        .max(50, "Имя пользователя не может содержать более 50 символов.")
    ),
    avatar: z.optional(z.instanceof(File)),
    firstName: z.optional(z.string().min(2, "Имя не может содержать менее 2 символов.").max(50, "Имя не может содержать более 50 символов.")),
    lastName: z.optional(z.string()),
    bio: z.optional(z.string()),
    newEmail: z.optional(z.string()),
    currentPassword: z.optional(z.string()),
    newPassword: z.optional(z.string())
});

export default function Page({params}: PageProps) {
    const username: string = params.username;
    const [user, setUser] = useState<User>();
    const [avatarFile, setAvatarFile] = useState<File>();

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserByUsername(username);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [username])

    const zodForm = useForm<z.infer<typeof UserScheme>>({
        resolver: zodResolver(UserScheme),
        defaultValues: {
            username: "",
            avatar: undefined,
            firstName: "",
            lastName: "",
            bio: "",
            newEmail: "",
            currentPassword: "",
            newPassword: ""
        }
    });

    const {handleSubmit, register, formState: {errors}} = zodForm;

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await getUserByUsername(username);
                setUser(userData);

                zodForm.reset({
                    username: userData.username,
                    avatar: undefined,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    bio: userData.bio,
                    newEmail: userData.email,
                    currentPassword: undefined,
                    newPassword: undefined
                });
            } catch (error) {
                console.error("Error fetching data: " + error);
            }
        }

        fetchData();
    }, [username, zodForm]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setUser(prev => prev ? {...prev, avatarUrl: URL.createObjectURL(file)} : prev);
        }
    };

    const onSubmit: SubmitHandler<z.infer<typeof UserScheme>> = (formData) => {
        const updatedUserData: UserUpdate = {
            ...formData,
            avatar: avatarFile
        };
        console.log(updatedUserData);
        updateUser(updatedUserData);
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
                    <Avatar variant="rounded" src={user?.avatarUrl} sx={{width: 112, height: 112}}/>
                    <p className="article-title">{user?.username}</p>
                    <p className="article-title">{user?.email}</p>
                    <p className="article-title">{user?.firstName}</p>
                    <p className="article-title">{user?.lastName}</p>
                    <p className="article-title">{user?.bio}</p>
                    <Link href={`/users/edit/${user?.username}`}><Button type="submit">Update</Button></Link>
                </Box>
            </FormProvider>
        </main>
    );
}
