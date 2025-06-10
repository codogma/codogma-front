import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, CardHeader, CardMedia, Collapse } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React, { useState } from 'react';

import { useT } from '@/app/i18n/client';
import { useAuth } from '@/components/AuthProvider';
import { AvatarImage } from '@/components/AvatarImage';
import { Bookmark } from '@/components/Bookmark';
import { DefaultImage } from '@/components/DefaultImage';
import MenuButton from '@/components/MenuButton';
import { Scrollbar } from '@/components/Scrollbar';
import { TimeAgo } from '@/components/TimeAgo';
import { GetCompilation, Language } from '@/types';

type CompilationCardProps = {
  readonly compilation: GetCompilation;
  readonly lang: Language;
  readonly refetch?: () => void;
};

export const CompilationCard = ({
  compilation,
  lang,
  refetch,
}: CompilationCardProps) => {
  const { state } = useAuth();
  const { t } = useT('articles');
  const [expanded, setExpanded] = useState(false);
  const items = [1, 2, 3, 4, 5];

  return (
    <Card variant='outlined' className='card'>
      <CardHeader
        avatar={
          <AvatarImage
            alt={compilation.ownerName}
            className='article-user-avatar'
            src={compilation.ownerAvatarUrl}
            variant='rounded'
            size={32}
          />
        }
        action={
          state.user?.username !== compilation?.ownerName ? (
            <Bookmark
              username={compilation.ownerName}
              id={compilation.id}
              isBookmarkedValue={compilation.isBookmarked}
              refetch={refetch}
            />
          ) : (
            <MenuButton
              compilation={compilation}
              lang={lang}
              refetch={refetch}
            />
          )
        }
        title={
          <Link
            href={`/users/${compilation.ownerName}`}
            className='article-user-name'
          >
            {compilation.ownerName}
          </Link>
        }
        subheader={
          <TimeAgo
            datetime={compilation.createdAt}
            className='article-datetime'
            lang={lang}
          />
        }
        className='card-header'
      />
      <Box className='card-media' onMouseLeave={() => setExpanded(false)}>
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia className='card-media'>
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                aspectRatio: '16/9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                perspective: 1000,
              }}
            >
              {items.map((item, index) => {
                let horizontalOffset = 0;
                if (index > 0) {
                  horizontalOffset =
                    Math.ceil(index / 2) * (index % 2 === 1 ? 1 : -1);
                }
                const distanceFromCenter = Math.abs(horizontalOffset);
                // Базовое вертикальное смещение: центральная карточка ниже, крайние – выше
                const baseTranslateY = 50 - distanceFromCenter * 20;
                // Дополнительное смещение для неидеального выравнивания задних карточек
                const additionalYOffset = horizontalOffset * 3; // Подберите нужный коэффициент
                const totalTranslateY = baseTranslateY + additionalYOffset;
                const isCenter = index === 0;

                return (
                  <Card
                    key={item}
                    elevation={isCenter ? 8 : 4}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      width: index === 0 ? '65%' : '60%', // Процентное значение относительно Box
                      aspectRatio: '16/9', // Соотношение сторон для карточки
                      transform: `
                translateX(${horizontalOffset * 25}%)
                translateY(${totalTranslateY}%)
                rotateY(${horizontalOffset * 15}deg)
                scale(${1 - distanceFromCenter * 0.05})
              `,
                      zIndex: 5 - distanceFromCenter,
                      opacity: 1 - distanceFromCenter * 0.07,
                      filter: `brightness(${1 - distanceFromCenter * 0.01})`,
                    }}
                  >
                    {compilation.articles[index] ? (
                      <DefaultImage
                        src={
                          compilation.articles[index].image &&
                          `${process.env.NEXT_PUBLIC_BASE_URL}${compilation.articles[index].image.imageUrl}`
                        }
                        top={0}
                        left={0}
                        zIndex={0}
                        className='scale-x-100 transition-transform will-change-transform'
                      />
                    ) : (
                      index == 0 && (
                        <DefaultImage
                          src={
                            compilation.imageUrl &&
                            `${process.env.NEXT_PUBLIC_BASE_URL}${compilation.imageUrl}`
                          }
                          top={0}
                          left={0}
                          zIndex={0}
                          className='scale-x-100 transition-transform will-change-transform'
                        />
                      )
                    )}
                  </Card>
                );
              })}
            </Box>
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
                  <Link href={`/compilations/${compilation.id}`}>
                    {compilation.title}
                  </Link>
                </Typography>
                <IconButton
                  sx={{
                    color: 'white',
                    flexShrink: 0,
                  }}
                  aria-label={`info about ${compilation.title}`}
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
            <Scrollbar style={{ height: '100%' }}>
              <div className='compilation-preview-content'>
                <section>
                  <b>{t('description')}:</b>
                  <p>{compilation.description}</p>
                </section>
                <section>
                  <b>{t('listOfArticles')}:</b>
                  <ul>
                    {compilation.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={`/${lang}/compilations/${compilation.id}/${article.id}`}
                        >
                          <span className='link'>{article.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </Scrollbar>
          </CardContent>
        </Collapse>
      </Box>
      <CardActions>
        <Stack direction='row' spacing={2}>
          <Link href={`/compilations/${compilation.id}`}>
            <Button className='article-btn' variant='outlined'>
              {t('readMoreBtn')}
            </Button>
          </Link>
        </Stack>
      </CardActions>
    </Card>
  );
};
