import { Box, LinearProgress } from '@mui/material';
import React from 'react';

import { useArticleProgress } from '@/helpers/useArticleProgress';
import { GetArticle } from '@/types';

type ArticleProgressBarProps = {
  readonly article: GetArticle;
};

export const ArticleProgressBar = ({ article }: ArticleProgressBarProps) => {
  const { progress } = useArticleProgress(article.id);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 5,
        p: '0 8px',
        boxSizing: 'border-box',
      }}
    >
      <LinearProgress
        variant='determinate'
        defaultValue={0}
        value={progress ?? 0}
        sx={{
          height: 5,
        }}
      />
    </Box>
  );
};
