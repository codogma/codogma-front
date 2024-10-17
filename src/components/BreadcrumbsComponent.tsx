'use client';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslation } from '@/app/i18n/client';

interface BreadcrumbsComponentProps {
  readonly title?: string;
  readonly lang: string;
  readonly depth: number;
}

export const BreadcrumbsComponent = ({
  title,
  lang,
  depth,
}: BreadcrumbsComponentProps) => {
  const pathname = usePathname();
  const { t } = useTranslation(lang);
  const pathSegments = pathname
    .split('/')
    .slice(2, depth)
    .filter((segment) => segment);

  if (title) pathSegments.push(title);
  return (
    <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
      {pathSegments.map((segment, index) => {
        const href = `/${lang}/${segment}/`;
        const isLastSegment = index === pathSegments.length - 1;
        return isLastSegment ? (
          <Typography key={href} className='breadcrumb-last-item'>
            {t(segment)}
          </Typography>
        ) : (
          <Link key={href} href={href} className='breadcrumb-item'>
            {t(segment)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
