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
  readonly size: number;
  readonly type?: 'avatar' | 'image';
  readonly fontSize?: SvgIconOwnProps['fontSize'];
}

export const AvatarImage = React.memo(function AvatarImage({
  src,
  alt = '',
  size,
  children,
  type,
  fontSize,
  ...props
}: AvatarImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const fetchAvatar = async () => {
      if (src?.startsWith('blob') || src?.startsWith('http')) {
        setImageSrc(src);
      } else if (alt) {
        const imageUrl = src
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${src}`
          : await generateAvatarUrl(alt, size);
        setImageSrc(imageUrl);
      } else if (src) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${src}`;
        setImageSrc(imageUrl);
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
});
