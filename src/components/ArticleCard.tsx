import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, CardHeader, CardMedia, Collapse } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { Scrollbar } from '@/components/Scrollbar';
import { TimeAgo } from '@/components/TimeAgo';
import { GetArticle, Language, UserRole } from '@/types';

type ArticleCardProps = {
  readonly article: GetArticle;
  readonly lang: Language;
};

export const ArticleCard = ({ article, lang }: ArticleCardProps) => {
  const { state } = useAuth();
  const pathname = usePathname();
  let urlPrefix = '';
  if (pathname.includes('compilations')) {
    urlPrefix = pathname;
  } else {
    urlPrefix = `/${lang}/articles`;
  }
  const { processContent } = useContentImageContext();
  const { t } = useT('articles');
  const previewContent = processContent(
    DOMPurify.sanitize(article.previewContent),
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <Card variant='outlined' className='card'>
      <CardHeader
        avatar={
          <AvatarImage
            alt={article.username}
            className='article-user-avatar'
            src={article.authorAvatarUrl}
            variant='rounded'
            size={32}
          />
        }
        action={
          state.isAuthenticated &&
          state.user?.role !== UserRole.ROLE_ADMIN && (
            <MenuButton article={article} lang={lang} />
          )
        }
        title={
          <Link
            href={`/users/${article.username}`}
            className='article-user-name'
          >
            {article.username}
          </Link>
        }
        subheader={
          <TimeAgo
            datetime={article.createdAt}
            className='article-datetime'
            lang={lang}
          />
        }
        className='card-header'
      />
      <Box className='card-media' onMouseLeave={() => setExpanded(false)}>
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia className='card-media'>
            <DefaultImage
              src={
                article.imageUrl &&
                `${process.env.NEXT_PUBLIC_BASE_URL}${article.imageUrl}`
              }
              top={0}
              left={0}
              zIndex={0}
              className='scale-x-100 transition-transform will-change-transform'
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                p: 1,
              }}
            >
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
                <Typography
                  variant='subtitle1'
                  sx={{
                    flexGrow: 1,
                    lineHeight: 1.2,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    maxHeight: '4.8em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  <Link href={`${urlPrefix}/${article.id}`}>
                    {article.title}
                  </Link>
                </Typography>
                <IconButton
                  sx={{
                    color: 'white',
                    flexShrink: 0,
                  }}
                  aria-label={`info about ${article.title}`}
                  onMouseEnter={() => setExpanded(true)}
                  onClick={() => setExpanded(true)}
                >
                  <InfoIcon />
                </IconButton>
              </Stack>
            </Box>
          </CardMedia>
        </Collapse>
        <Collapse in={expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardContent component='div' className='card-content aspect-[16/8]'>
            {(state.user?.username === article.username ||
              state.user?.role === UserRole.ROLE_ADMIN) && (
              <Stack direction='row' spacing={1}>
                <Chip
                  size='small'
                  color='primary'
                  label={t(article.status.toLowerCase())}
                  variant='outlined'
                />
                <Chip
                  size='small'
                  color='success'
                  label={t(article.language.toLowerCase() + '_short')}
                  variant='outlined'
                />
              </Stack>
            )}
            <Scrollbar style={{ height: '100%' }}>
              <div className='article-preview-content'>{previewContent}</div>
            </Scrollbar>
          </CardContent>
        </Collapse>
      </Box>
      <CardActions>
        <Stack direction='row' spacing={2}>
          <Link href={`${urlPrefix}/${article.id}`}>
            <Button className='article-btn' variant='outlined'>
              {t('readMoreBtn')}
            </Button>
          </Link>
        </Stack>
      </CardActions>
    </Card>
  );
};
