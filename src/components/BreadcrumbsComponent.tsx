'use client';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { languages } from '@/constants/i18n';
import { Language } from '@/types';

interface BreadcrumbsComponentProps {
  title: string;
}

const segmentNames: Record<string, string> = {
  articles: 'Articles',
  categories: 'Categories',
};

export const BreadcrumbsComponent = ({ title }: BreadcrumbsComponentProps) => {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment && !languages.includes(segment as Language));

  return (
    <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
      {pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLastSegment = index === pathSegments.length - 1;
        const displayName = isLastSegment
          ? title
          : segmentNames[segment] || segment;

        return isLastSegment ? (
          <Typography key={href} className='breadcrumb-last-item'>
            {displayName}
          </Typography>
        ) : (
          <Link key={href} href={href} className='breadcrumb-item'>
            {displayName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
