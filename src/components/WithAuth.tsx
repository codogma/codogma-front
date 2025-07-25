'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FC, useEffect } from 'react';

import { Spinner } from '@/components/Spinner';

export const WithAuth = <P extends object>(WrappedComponent: FC<P>) => {
  const Wrapper: FC<P> = (props) => {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
      if (status !== 'authenticated') {
        router.push('/sign-in');
      }
    }, [status, router]);

    if (status === 'loading') {
      return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };
  return Wrapper;
};
