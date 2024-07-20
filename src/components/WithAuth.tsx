"use client";
import {FC, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from "@/components/AuthProvider";

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
    const Wrapper: FC<P> = (props) => {
        const router = useRouter();
        const {state} = useAuth();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            if (state.isAuthenticated) {
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        }, [state.isAuthenticated, router]);

        if (isLoading) {
            return <div>Loading...</div>; // Можно заменить на ваш компонент загрузки
        }

        return <WrappedComponent {...props} />;
    };
    return Wrapper;
};