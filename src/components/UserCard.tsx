import { PersonAddAlt1 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import { DefaultImage } from '@/components/DefaultImage';
import { GetUserDTO, Language, UserRole } from '@/types';

type UserCardProps = {
  readonly user: GetUserDTO;
  readonly lang: Language;
};

export const UserCard = ({ user, lang }: UserCardProps) => {
  const t = useTranslations('authorsPage');
  const imgRef = useRef<HTMLImageElement>(null);
  const [expanded, setExpanded] = useState(false);

  return user ? (
    <Card variant='outlined' className='card'>
      <Box
        className='card-media'
        sx={{ height: 250 }}
        onMouseLeave={() => setExpanded(false)}
      >
        <Collapse in={!expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardMedia
            className='card-media'
            sx={{
              height: 150,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: 'white',
                zIndex: 1,
              }}
            >
              <CardHeader
                action={
                  <IconButton
                    aria-label={`info about ${user.username}`}
                    onMouseEnter={() => setExpanded(true)}
                    onClick={() => setExpanded(true)}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </Box>
            <DefaultImage
              ref={imgRef}
              src={
                user.bannerUrl
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.bannerUrl}`
                  : '/images/blob-scene-haikei.svg'
              }
              className='card-media-image'
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <AvatarImage
                alt={user.username}
                src={user.avatarUrl}
                variant='circular'
                size={100}
                sx={{
                  border: '2px solid white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                }}
              />
            </Box>
          </CardMedia>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
                pt: 2,
                pb: '16px !important',
              }}
            >
              <Link href={`/${lang}/users/${user.username}`}>
                <Typography
                  variant='h6'
                  component='div'
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 0.5,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </Typography>
              </Link>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                @{user.username}
              </Typography>
            </CardContent>
          </Box>
        </Collapse>
        <Collapse in={expanded} timeout={{ enter: 300, exit: 300 }}>
          <CardContent component='div' className='card-content aspect-[16/8]'>
            {user?.role === UserRole.ROLE_AUTHOR &&
              user.categories?.length > 0 && (
                <Box
                  sx={{
                    height: '100%',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    pr: 1,
                  }}
                >
                  <div className='preview-content'>
                    <section>
                      <b>{t('aboutMyself')}:</b>
                      <p>{user.bio}</p>
                    </section>
                    <section>
                      <b>{t('writesInCategories')}:</b>
                      <ul>
                        {user.categories?.map((category) => (
                          <li key={category.id} className='tag-item'>
                            <Link
                              key={category.id}
                              href={`/${lang}/categories/${category.id}`}
                            >
                              <Chip
                                variant='outlined'
                                label={category.name}
                                avatar={
                                  <AvatarImage
                                    alt={category?.name}
                                    src={category?.icon?.imageUrl}
                                    variant='circular'
                                    size={24}
                                  />
                                }
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </Box>
              )}
          </CardContent>
        </Collapse>
      </Box>
      <CardActions>
        <Button
          variant='outlined'
          startIcon={<PersonAddAlt1 />}
          fullWidth
          sx={{
            mt: 1,
            mb: 2,
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          {t('subscribe')}
        </Button>
      </CardActions>
    </Card>
  ) : (
    <Card variant='outlined' className='card'>
      <Skeleton variant='rectangular' height={140} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: '-60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Skeleton variant='circular' width={100} height={100} />
      </Box>
      <CardContent sx={{ textAlign: 'center', pt: 4 }}>
        <Skeleton variant='text' width='60%' sx={{ mx: 'auto' }} />
        <Skeleton variant='text' width='40%' sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton
          variant='rectangular'
          height={36}
          sx={{ borderRadius: '20px' }}
        />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant='text' width='50%' sx={{ mx: 'auto' }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 1,
            }}
          >
            <Skeleton
              variant='rectangular'
              width={60}
              height={24}
              sx={{ borderRadius: '4px' }}
            />
            <Skeleton
              variant='rectangular'
              width={60}
              height={24}
              sx={{ borderRadius: '4px' }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
