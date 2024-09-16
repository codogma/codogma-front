"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {z} from "zod";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@/types";
import {Badge, Box, Button} from "@mui/material";
import {deleteUser, getAuthors, getUserByUsername, updateUser, UserUpdate} from "@/helpers/userApi";
import {ModeEditOutlineOutlined} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import FormInput from "@/components/FormInput";
import IconButton from "@mui/material/IconButton";
import {WithAuth} from "@/components/WithAuth";
import Link from "next/link";
import {AvatarImage} from "@/components/AvatarImage";
import {useAuth} from "@/components/AuthProvider";
import Spinner from "@/components/Spinner";

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
    newPassword: z.optional(z.string()),
    shortInfo: z.optional(z.string())
});

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

function Users() {
    const {state} = useAuth();
    const username: string | undefined = state.user?.username
    const [user, setUser] = useState<User>();
    const [avatarFile, setAvatarFile] = useState<File>();
    const [users, setUsers] = useState<User[]>([]);

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
            newPassword: "",
            shortInfo: ""
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
                    newPassword: undefined,
                    shortInfo: userData.shortInfo
                });
            } catch (error) {
                console.error("Error fetching data: " + error);
            }
        }

        fetchData();
    }, [username, zodForm]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allUsers = await getAuthors();
                console.log(allUsers)
                setUsers(allUsers);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

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

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const userId = event.currentTarget.id
        setUsers(users.filter((user) => user.username !== userId))
        deleteUser(userId)
    }

    if (!user) {
        return <Spinner/>;
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
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        badgeContent={
                            <IconButton component="label" color="inherit" sx={{p: 0}}>
                                {user?.avatarUrl && <ModeEditOutlineOutlined color="primary"/>}
                                <VisuallyHiddenInput
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </IconButton>
                        }
                    >
                        <AvatarImage alt={user?.username} variant="rounded" src={user?.avatarUrl} size={112}/>
                    </Badge>
                    <FormInput name="username" label="Username" variant="standard" defaultValue={user?.username}/>
                    <FormInput name="newEmail" label="Email" type="email" variant="standard"
                               defaultValue={user?.email}/>
                    <FormInput name="firstName" label="First name" variant="standard" defaultValue={user?.firstName}/>
                    <FormInput name="lastName" label="Last name" variant="standard" defaultValue={user?.lastName}/>
                    <FormInput name="bio" label="Bio" variant="standard" defaultValue={user?.bio}/>
                    <FormInput name="shortInfo" label="ShortInfo" variant="standard" defaultValue={user?.shortInfo}/>
                    <FormInput name="currentPassword" label="Current password" type="password" variant="standard"/>
                    <FormInput name="newPassword" label="New password" type="password" variant="standard"/>
                    <Button type="submit">Update</Button>
                    <Link href={`/users`}><Button id={user?.username} onClick={handleDelete}>Delete</Button></Link>
                </Box>
            </FormProvider>
        </main>
    );
}

export default WithAuth(Users)