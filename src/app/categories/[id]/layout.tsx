'use client';
import React from 'react';
import { Category } from '@/types';
import NavTabs, { LinkTabProps } from '@/components/NavTabs';
import { getCategoryById } from '@/helpers/categoryApi';
import CardContent from '@mui/material/CardContent';
import { Badge } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import { AvatarImage } from '@/components/AvatarImage';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

type PageParams = {
  id: number;
};

type PageProps = {
  params: PageParams;
  children: React.ReactNode;
};

export default function Layout({ params, children }: PageProps) {
  const categoryId = params.id;
  const router = useRouter();
  // const [category, setCategory] = useState<Category>({} as Category);

  const tabs: LinkTabProps[] = [
    { label: 'Articles', href: `/categories/${categoryId}/articles` },
    { label: 'Users', href: `/categories/${categoryId}/authors` },
  ];

  // useEffect(() => {
  //     async function fetchData() {
  //         try {
  //             const categoryData = await getCategoryById(categoryId);
  //             setCategory(categoryData);
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //             router.push('/');
  //         }
  //     }
  //
  //     fetchData();
  // }, [categoryId]);

  const {
    data: category,
    isPending,
    isError,
    error,
  } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryById(categoryId),
  });

  if (isError) {
    console.error('Error fetching data:', error);
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
