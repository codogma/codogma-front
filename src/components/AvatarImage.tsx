import React from 'react';
import {Avatar, AvatarProps} from '@mui/material';
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";

interface AvatarImageProps extends AvatarProps {
    size: number;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({src, alt = "avatar", size, ...props}) => {
    return (
        <Avatar {...props} sx={{width: size, height: size, position: 'relative', background: 'white'}}>
            {src && (
                <Image
                    alt={alt}
                    src={src}
                    width={size}
                    height={size}
                    layout="fixed"
                    quality={70}
                    priority
                />)}
            {!src && <ImageIcon/>}
        </Avatar>
    );
};