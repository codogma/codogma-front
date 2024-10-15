'use client';
import { Badge } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

import { AvatarImage } from '@/components/AvatarImage';
import NavTabs, { TabProps } from '@/components/NavTabs';
import { getCategoryById } from '@/helpers/categoryApi';
import { devConsoleError } from '@/helpers/devConsoleLog';
import { Category } from '@/types';

type PageParams = {
  id: number;
  lng: string;
};

type PageProps = {
  readonly params: PageParams;
  readonly children: React.ReactNode;
};

export default function Layout({ params: { id, lng }, children }: PageProps) {
  const router = useRouter();
  // const [category, setCategory] = useState<Category>({} as Category);

  const tabs: TabProps[] = [
    { label: 'Articles', href: `/${lng}/categories/${id}/articles` },
    { label: 'Users', href: `/${lng}/categories/${id}/authors` },
  ];

  const {
    data: category,
    isError,
    error,
  } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
  });

  if (isError) {
    devConsoleError('Error fetching data:', error);
    router.push('/');
  }

  return (
    <section>
      <Card variant='outlined' className='card'>
        <CardContent className='card-content'>
          <div className='meta-container'>
            <Badge
              className='items-start'
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton component='label' color='inherit' sx={{ p: 0 }} />
              }
            >
              <AvatarImage
                alt={category?.name}
                className='category-img'
                variant='rounded'
                src={category?.imageUrl}
                size={48}
              />
            </Badge>
            <div>
              <h1 className='category-card-name'>{category?.name}</h1>
              <p className='category-card-description'>
                {category?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <NavTabs tabs={tabs} />
      {children}
    </section>
  );
}
