'use client';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { Spinner } from '@/components/Spinner';

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
  const Wrapper: FC<P> = (props) => {
    const router = useRouter();
    const { state, isInitializing } = useAuth();

    useEffect(() => {
      if (!isInitializing && !state.isAuthenticated) {
        router.push('/sign-in');
      }
    }, [isInitializing, state.isAuthenticated, router]);

    if (isInitializing || !state.isAuthenticated) {
      return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };
  return Wrapper;
};
