"use client";
import {FC, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {axiosInstance} from '@/helpers/axiosInstance';
import Cookies from "js-cookie";

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
    const Wrapper: FC<P> = (props) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const token = Cookies.get("auth-token");
                    console.log(token)
                    if (!token) {
                        router.push('/login');
                    } else {
                        await axiosInstance.get('/auth/auth-check');
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    router.push('/login');
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();
        }, [router]);

        if (isLoading) {
            return <div>Loading...</div>; // Можно заменить на ваш компонент загрузки
        }

        if (!isAuthenticated) {
            return null; // Или компонент/страница для неавторизованных пользователей
        }

        return <WrappedComponent {...props} />;
    };
    return Wrapper;
};