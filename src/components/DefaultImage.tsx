import { Box, BoxProps, Typography } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

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
  alt = '',
  priority = true,
  quality = 80,
  width = '100%',
  height = '100%',
  className,
  ...props
}) => {
  return (
    <Box {...props} width={width} height={height} textAlign='center'>
      <Image
        src={src}
        alt={alt}
        fill={true}
        priority={priority}
        quality={quality}
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
