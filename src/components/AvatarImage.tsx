import React from 'react';
import {Avatar, AvatarProps} from '@mui/material';
import Image from "next/image";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";

interface AvatarImageProps extends AvatarProps {
    size: number;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({src, alt = "avatar", size = 40, ...props}) => {
    return (
        <Avatar {...props} sx={{width: size, height: size, position: 'relative', background: 'white'}}>
            {src && (
                <Image
                    alt={alt}
                    src={src}
                    width={size}
                    height={size}
                    quality={70}
                    priority
                />)}
            {!src && <SensorOccupiedIcon className="text-limed-spruce-rgba dark:text-woodsmoke-rgba w-6 h-6"/>}
        </Avatar>
    );
};