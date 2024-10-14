import {
  BrokenImage,
  Image as ImageIcon,
  SensorOccupied,
} from '@mui/icons-material';
import { Avatar, AvatarProps, SvgIconOwnProps } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { generateAvatarUrl } from '@/helpers/generateAvatar';

interface AvatarImageProps extends AvatarProps {
  size: number;
  type?: 'avatar' | 'image';
  fontSize?: SvgIconOwnProps['fontSize'];
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt = '',
  size = 40,
  children,
  type,
  fontSize,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  useEffect(() => {
    const fetchAvatar = async () => {
      if (src?.startsWith('blob:' || 'http')) {
        setImageSrc(src);
      } else if (alt) {
        const avatarUrl = src
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${src}`
          : await generateAvatarUrl(alt, size);
        setImageSrc(avatarUrl);
      }
    };

    fetchAvatar();
  }, [src, alt, size]);

  return (
    <Avatar
      {...props}
      sx={{
        width: size,
        height: size,
        position: 'relative',
        background: 'white',
      }}
    >
      {imageSrc && !children && (
        <Image
          alt={alt}
          src={imageSrc}
          width={size}
          height={size}
          quality={70}
          priority
        />
      )}
      {!src && !children && !alt && type === 'avatar' && (
        <SensorOccupied
          fontSize={fontSize}
          className='size-6 text-limed-spruce-rgba dark:text-woodsmoke-rgba'
        />
      )}
      {!src && !children && !alt && type === 'image' && (
        <ImageIcon
          fontSize={fontSize}
          className='size-6 text-limed-spruce-rgba dark:text-woodsmoke-rgba'
        />
      )}
      {!src && !children && !alt && !type && (
        <BrokenImage
          fontSize={fontSize}
          className='size-6 text-limed-spruce-rgba dark:text-woodsmoke-rgba'
        />
      )}
      {children}
    </Avatar>
  );
};
