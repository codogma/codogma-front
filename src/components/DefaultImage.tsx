import { Box, BoxProps, SxProps, Theme, Typography } from '@mui/material';
import Image from 'next/image';
import React, { FC } from 'react';

interface DefaultImageProps extends BoxProps {
  readonly src: string;
  readonly alt?: string;
  readonly priority?: boolean;
  readonly quality?: number;
  readonly width?: BoxProps['width'];
  readonly height?: BoxProps['height'];
  readonly sx?: SxProps<Theme>;
}

export const DefaultImage: FC<DefaultImageProps> = ({
  src,
  alt = '',
  priority = true,
  quality = 80,
  width,
  height,
  style,
  className,
  sx,
  ...props
}) => {
  const widthVal = width ?? height;
  const heightVal = height ?? width;
  const hasWidth = isNaN(Number(widthVal));
  const hasHeight = isNaN(Number(heightVal));
  const useFill = hasWidth && hasHeight;

  return (
    <Box
      {...props}
      width={width ?? '100%'}
      height={height ?? '100%'}
      textAlign='center'
      sx={sx}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        quality={quality}
        className={className}
        style={{
          ...style,
          objectFit: 'cover',
          transition: 'transform 0.4s ease',
        }}
        {...(useFill
          ? { fill: true }
          : { width: Number(widthVal), height: Number(heightVal) })}
      />
      {alt && (
        <Typography variant='body1' color='textSecondary' mt={1} mb={1}>
          {alt}
        </Typography>
      )}
    </Box>
  );
};
