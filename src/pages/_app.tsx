import {AppCacheProvider, EmotionCacheProviderProps} from '@mui/material-nextjs/v14-pagesRouter';
import {JSX, ReactNode} from 'react';
import {Head} from "next/document";

export default function MyApp(props: JSX.IntrinsicAttributes & EmotionCacheProviderProps & {
    children?: ReactNode | undefined;
}) {
    return (
        <AppCacheProvider {...props}>
            <Head>
            </Head>
        </AppCacheProvider>
    );
}