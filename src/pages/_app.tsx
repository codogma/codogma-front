import { AppCacheProvider, EmotionCacheProviderProps} from '@mui/material-nextjs/v14-pagesRouter';
import {JSX, ReactNode} from 'react';
import {createTheme} from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import {Head} from "next/document";

export default function MyApp(props: JSX.IntrinsicAttributes & EmotionCacheProviderProps & { children?: ReactNode | undefined; }) {
    return (
         <AppCacheProvider {...props}>
             <Head>
             </Head>
            </AppCacheProvider>
    );
}