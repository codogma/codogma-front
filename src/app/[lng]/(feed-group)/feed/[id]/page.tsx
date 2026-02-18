'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { use } from 'react';

import { useArticle } from '@/components/ArticleProvider';
import { AvatarImage } from '@/components/AvatarImage';
import ButtonAlertDialog from '@/components/ButtonAlertDialog';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { TimeAgo } from '@/components/TimeAgo';
import { Language, UserRole } from '@/types';

type PageProps = {
  readonly params: Promise<{ lng: string }>;
};

export default function Page({ params }: PageProps) {
  const { lng } = use(params);
  const lang = lng as Language;
  const { article } = useArticle();
  const { data: state } = useSession();
  const { processContent } = useContentImageContext();
  const content = processContent(DOMPurify.sanitize(article.content));

  return (
    <Card key={article.id} variant='outlined' className='card'>
      <CardContent className='card-content'>
        <div className='card-header'>
          <AvatarImage
            alt={article.username}
            src={article.authorAvatarUrl}
            variant='rounded'
            size={32}
          />
          <Link
            className='article-user-name'
            href={`/users/${article.username}`}
          >
            {article.username}
          </Link>
          <TimeAgo
            datetime={article.createdAt}
            className='article-datetime'
            lang={lang}
          />
        </div>
        <div className='article-category'>
          {article.categories?.map((category) => (
            <span className='category-item' key={category.id}>
              <Link
                className='category-link'
                href={`/categories/${category.id}`}
              >
                {category.name}
              </Link>
            </span>
          ))}
        </div>
        <div className='article-content'>{content}</div>
        <div className='article-presenter-meta'>
          <div>
            Категории:{' '}
            {article.categories?.map((category) => (
              <span className='category-item' key={category.id}>
                <Link
                  className='category-link'
                  href={`/categories/${category.id}`}
                >
                  {category.name}
                </Link>
              </span>
            ))}
          </div>
          <div>
            Теги:{' '}
            {article.tags?.map((tag) => (
              <span className='tag-item' key={tag.id}>
                <Link className='tag-link' href={`/categories/${tag.id}`}>
                  {tag.name}
                </Link>
              </span>
            ))}
          </div>
        </div>
        {state?.user?.name === article.username &&
          state?.user?.role === UserRole.ROLE_AUTHOR && (
            <ButtonAlertDialog article={article} lang={lang} />
          )}
      </CardContent>
    </Card>
  );
}
