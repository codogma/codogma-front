"use client";
import {FC, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from "@/components/AuthProvider";
import {Spinner} from "@/components/Spinner";

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
    const Wrapper: FC<P> = (props) => {
        const router = useRouter();
        const {state} = useAuth();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            console.log(props)
            if (state.isAuthenticated) {
                setIsLoading(false);
            } else {
                router.push('/sign-in');
            }
        }, [state, router]);

        if (isLoading) {
            return <Spinner/>;
        }

        return <WrappedComponent {...props} />;
    };
    return Wrapper;
};