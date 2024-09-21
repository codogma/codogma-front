import React, {FC} from 'react';
import {Box, BoxProps} from '@mui/material';
import Image from 'next/image';
import clsx from "clsx";

interface DefaultImageProps extends BoxProps {
    src: string;
    alt?: string;
    priority?: boolean;
    quality?: number;
    width?: BoxProps['width'];
    height?: BoxProps['height'];
}

export const DefaultImage: FC<DefaultImageProps> = ({
                                                        src,
                                                        alt = 'image',
                                                        priority = true,
                                                        quality = 80,
                                                        width = "100%",
                                                        height = "100%",
                                                        className,
                                                        ...props
                                                    }) => {
    return (
        <Box
            {...props}
            width={width}
            height={height}
        >
            <Image
                src={src}
                alt={alt}
                fill={true}
                priority={priority}
                quality={quality}
                className={clsx("object-cover", className)}
            />
        </Box>
    );
};