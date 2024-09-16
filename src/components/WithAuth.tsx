"use client";
import {FC, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from "@/components/AuthProvider";

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
    const Wrapper: FC<P> = (props) => {
        const router = useRouter();
        const {state} = useAuth();

        useEffect(() => {
            if (!state.isAuthenticated) {
                router.push('/sign-in');
            }
        }, [state.isAuthenticated, router]);

        return <WrappedComponent {...props} />;
    };
    return Wrapper;
};