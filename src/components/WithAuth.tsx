import {FC, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {axiosInstance} from "@/helpers/axiosInstance";

export const WithAuth = (WrappedComponent: FC) => {
    const Wrapper: FC<any> = (props) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    await axiosInstance.get('/auth/auth-check');
                    setIsAuthenticated(true);
                } catch (error) {
                    router.replace('/login');
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