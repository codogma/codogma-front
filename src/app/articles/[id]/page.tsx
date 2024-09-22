'use client';
import React, { useEffect, useState } from 'react';
import { Article, UserRole } from '@/types';
import { getArticleById } from '@/helpers/articleApi';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { TimeAgo } from '@/components/TimeAgo';
import { Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuth } from '@/components/AuthProvider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CommentList from '@/components/CommentList';
import Typography from '@mui/material/Typography';
import { AvatarImage } from '@/components/AvatarImage';
import { useContentImageContext } from '@/components/ContentImageProvider';

type PageParams = {
  id: number;
};

type PageProps = {
  params: PageParams;
};

export default function Page({ params }: PageProps) {
  const articleId = params.id;
  const { state } = useAuth();
  const { processContent } = useContentImageContext();
  const [article, setArticle] = useState<Article>({
    id: 0,
    title: '',
    content: '',
    previewContent: '',
    username: '',
    authorAvatarUrl: '',
    createdAt: new Date(),
    categories: [],
    tags: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData = await getArticleById(articleId);
        const contentNode = processContent(
          DOMPurify.sanitize(articleData.content),
        );
        setArticle({ ...articleData, contentNode });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [articleId, processContent]);

  return (
    <>
      <Card key={article.id} variant='outlined' className='card'>
        <CardContent className='card-content'>
          <div className='meta-container'>
            <AvatarImage
              alt={article.username}
              className='article-user-avatar'
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
            />
          </div>
          <h1 className='article-title'>{article.title}</h1>
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
          <div className='article-content'>{article.contentNode}</div>
          <div className='article-presenter-meta'>
            <div className='article-category-pm'>
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
            <div className='article-tag-pm'>
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
          {state.user?.username === article.username &&
            state.user?.role === UserRole.ROLE_AUTHOR && (
              <Link href={`/articles/edit/${article.id}`}>
                <Button
                  className='article-btn'
                  variant='outlined'
                  startIcon={<EditOutlinedIcon />}
                >
                  Edit
                </Button>
              </Link>
            )}
        </CardContent>
      </Card>
      <Typography component='div'>Comments:</Typography>
      <CommentList articleId={articleId} />
    </>
  );
}
