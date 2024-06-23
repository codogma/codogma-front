import {DocumentHeadTags, documentGetInitialProps, DocumentHeadTagsProps} from '@mui/material-nextjs/v14-pagesRouter';
import {DocumentProps, Head, Html, Main, NextScript} from "next/document";


export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
    return (
        <Html lang="en">
            <Head>
                <DocumentHeadTags {...props} />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}

MyDocument.getInitialProps = async (ctx: any) => {const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};