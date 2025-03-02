import { Box, BoxProps, Typography } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

import { devConsoleInfo } from '@/helpers/devConsoleLogs';

interface DefaultImageProps extends BoxProps {
  readonly src: string;
  readonly alt?: string;
  readonly priority?: boolean;
  readonly quality?: number;
  readonly width?: BoxProps['width'];
  readonly height?: BoxProps['height'];
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
  ...props
}) => {
  const widthVal = width ?? height;
  const heightVal = height ?? width;
  const hasWidth = isNaN(Number(widthVal));
  const hasHeight = isNaN(Number(heightVal));
  const useFill = hasWidth && hasHeight;

  devConsoleInfo({ width, height, useFill });
  return (
    <Box
      {...props}
      width={width ?? '100%'}
      height={height ?? '100%'}
      textAlign='center'
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        quality={quality}
        style={style}
        className={clsx('object-cover', className)}
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
