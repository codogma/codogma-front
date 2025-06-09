import { BrokenImage } from '@mui/icons-material';
import { Box, BoxProps, Typography } from '@mui/material';
import Image from 'next/image';
import React, { forwardRef } from 'react';

interface DefaultImageProps extends BoxProps {
  readonly src: string;
  readonly alt?: string;
  readonly priority?: boolean;
  readonly quality?: number;
}

export const DefaultImage = forwardRef<HTMLImageElement, DefaultImageProps>(
  (
    {
      src,
      alt = '',
      priority = true,
      quality = 80,
      width,
      height,
      position = 'relative',
      style,
      className,
      sx,
      ...props
    },
    ref,
  ) => {
    const widthVal = width ?? height;
    const heightVal = height ?? width;
    const hasWidth = isNaN(Number(widthVal));
    const hasHeight = isNaN(Number(heightVal));
    const useFill = hasWidth && hasHeight;
    const size = useFill
      ? { fill: true }
      : { width: Number(widthVal), height: Number(heightVal) };

    return (
      <Box
        {...props}
        width={width ?? '100%'}
        height={height ?? '100%'}
        textAlign='center'
        position={position}
        sx={sx}
      >
        {src ? (
          <Image
            ref={ref}
            src={src}
            alt={alt}
            priority={priority}
            quality={quality}
            className={className}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{
              ...style,
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            {...size}
          />
        ) : (
          <BrokenImage
            className='text-limed-spruce-rgba dark:text-white'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {alt && (
          <Typography variant='body1' color='textSecondary' mt={1} mb={1}>
            {alt}
          </Typography>
        )}
      </Box>
    );
  },
);

DefaultImage.displayName = 'DefaultImage';
