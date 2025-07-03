import {
  BrokenImage,
  Image as ImageIcon,
  SensorOccupied,
} from '@mui/icons-material';
import { Avatar, AvatarProps, SvgIconOwnProps } from '@mui/material';
import Image from 'next/image';
import React from 'react';

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
  const makeFullUrl = (urlPath: string) =>
    urlPath.startsWith('blob')
      ? urlPath
      : `${process.env.NEXT_PUBLIC_BASE_URL}${urlPath}`;

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
      {!!src && !children && (
        <Image
          alt={alt}
          src={makeFullUrl(src)}
          width={size}
          height={size}
          quality={70}
          priority
        />
      )}
      {!src && !children && !alt && type === 'avatar' && (
        <SensorOccupied
          fontSize={fontSize}
          className='text-limed-spruce-rgba dark:text-woodsmoke-rgba'
          width={size}
          height={size}
        />
      )}
      {!src && !children && !alt && type === 'image' && (
        <ImageIcon
          fontSize={fontSize}
          className='text-limed-spruce-rgba dark:text-woodsmoke-rgba'
          width={size}
          height={size}
        />
      )}
      {!src && !children && !alt && !type && (
        <BrokenImage
          fontSize={fontSize}
          className='text-limed-spruce-rgba dark:text-woodsmoke-rgba'
          width={size}
          height={size}
        />
      )}
      {children}
    </Avatar>
  );
});
