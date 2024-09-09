"use client";
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {FacebookIcon, GoogleIcon} from '@/components/CustomIcons';
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {register, RegisterUser} from "@/helpers/authApi";
import {z} from 'zod';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {generateAvatar} from "@/helpers/generateAvatar";

const signUpSchema = z.object({
    username: z.string().min(1, {message: "Name is required"}),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
});

export default function SignUp() {
    const router = useRouter();
    const [serverError, setServerError] = useState('');

    const methods = useForm<RegisterUser>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit: SubmitHandler<RegisterUser> = (data: RegisterUser) => {
        try {
            const {username} = data;
            generateAvatar(username, 200).then(file => register({...data, avatar: file}));
            router.push("/login");
        } catch (error) {
            setServerError('An error occurred during registration.');
        }
    };

    return (
        <Container sx={{direction: "column", justifyContent: "space-between", height: "100%"}}>
            <Stack
                sx={{
                    justifyContent: 'center',
                    height: '100dvh',
                    p: 2,
                }}
            >
                <Card className="flex flex-col self-center w-full p-4 gap-2 mx-auto sm:w-[450px]"
                      variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                    >
                        Sign up
                    </Typography>
                    <FormProvider {...methods}>
                        <Box
                            component="form"
                            onSubmit={methods.handleSubmit(onSubmit)}
                            sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                        >
                            <FormControl>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <TextField
                                    autoComplete="username"
                                    {...methods.register("username")}
                                    fullWidth
                                    id="username"
                                    placeholder="username"
                                    error={!!methods.formState.errors.username}
                                    helperText={methods.formState.errors.username?.message}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    fullWidth
                                    {...methods.register("email")}
                                    id="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    error={!!methods.formState.errors.email}
                                    helperText={methods.formState.errors.email?.message}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    fullWidth
                                    {...methods.register("password")}
                                    type="password"
                                    id="password"
                                    placeholder="••••••"
                                    autoComplete="new-password"
                                    error={!!methods.formState.errors.password}
                                    helperText={methods.formState.errors.password?.message}
                                />
                            </FormControl>
                            {serverError && <Typography color="error">{serverError}</Typography>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                            >
                                Sign up
                            </Button>
                            <Typography sx={{textAlign: 'center'}}>
                                Already have an account?{' '}
                                <span>
                                    <Link href="/login">Sign in</Link>
                                </span>
                            </Typography>
                        </Box>
                    </FormProvider>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>or</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon/>}
                        >
                            Sign up with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon/>}
                        >
                            Sign up with Facebook
                        </Button>
                    </Box>
                </Card>
            </Stack>
        </Container>
    );
}