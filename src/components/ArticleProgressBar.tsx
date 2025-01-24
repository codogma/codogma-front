import { Box, LinearProgress } from '@mui/material';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { useArticleProgress } from '@/helpers/useArticleProgress';
import { Article } from '@/types';

type ArticleProgressBarProps = {
  readonly lang: string;
  readonly articleData: Article;
};

export const ArticleProgressBar = ({
  lang,
  articleData,
}: ArticleProgressBarProps) => {
  const { progress } = useArticleProgress(articleData.id);
  const { t } = useTranslation(lang, 'articles');

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
        value={progress ?? 0}
        sx={{
          height: 5,
        }}
      />
    </Box>
  );
};
