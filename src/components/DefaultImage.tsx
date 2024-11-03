import { Box, BoxProps, Typography } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

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
  width = '100%',
  height = '100%',
  style,
  className,
  ...props
}) => {
  return (
    <Box {...props} width={width} height={height} textAlign='center'>
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        fill={isNaN(Number(width)) || isNaN(Number(height))}
        priority={priority}
        quality={quality}
        style={style}
        className={clsx('object-cover', className)}
      />
      {alt && (
        <Typography variant='body1' color='textSecondary' mt={1} mb={1}>
          {alt}
        </Typography>
      )}
    </Box>
  );
};
