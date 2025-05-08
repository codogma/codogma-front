'use client';
import {
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import React from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ArticleActions } from '@/components/ArticleActions';
import { useArticle } from '@/components/ArticleProvider';
import Articles from '@/components/Articles';
import { AvatarImage } from '@/components/AvatarImage';
import { CommentList } from '@/components/CommentList';
import { useContentImageContext } from '@/components/ContentImageProvider';
import { useNavigationState } from '@/components/NavigationProvider';
import { TimeAgo } from '@/components/TimeAgo';
import { getRecommendationsArticleById } from '@/helpers/articleApi';
import { GetArticle, Language } from '@/types';

type ArticleProps = {
  readonly lng: Language;
};

export default function Article({ lng }: ArticleProps) {
  const { article } = useArticle();
  const { isFullscreen } = useNavigationState();
  const { processContent } = useContentImageContext();
  const { t } = useTranslation(lng, 'articles');
  const content = processContent(DOMPurify.sanitize(article.content));

  const { data, isFetching } = useQuery<GetArticle>({
    queryKey: ['articles', article?.id],
    queryFn: () => getRecommendationsArticleById(article?.id),
    enabled: !!article?.id,
  });

  const articles: GetArticle[] = (data ?? []) as GetArticle[];
  const hasArticles = articles && articles.length > 0;

  return (
    <>
      <Card id={`article-${article.id}`} variant='outlined' className='card'>
        {!isFullscreen && (
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
                lang={lng}
              />
            }
            className='card-header'
          />
        )}
        <CardContent id='article-content' className='card-content'>
          <h1 className='article-title'>{article.title}</h1>
          <div className='article-content'>{content}</div>
        </CardContent>
        <CardActions className='article-presenter-meta'>
          {!isFullscreen && (
            <>
              <section>
                <span className='article-pm-list-title'>
                  {t('categories')}:
                </span>
                <ul className='article-pm-list'>
                  {article.categories?.map((category) => (
                    <li className='category-item' key={category.id}>
                      <Link
                        className='category-link'
                        scroll={false}
                        href={`/${lng}/categories/${category.id}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <span className='article-pm-list-title'>{t('tags')}:</span>
                <ul className='article-pm-list'>
                  {article.tags?.map((tag) => (
                    <li className='tag-item' key={tag.id}>
                      <Link
                        className='tag-link'
                        scroll={false}
                        href={{
                          pathname: `/${lng}/articles`,
                          query: { type: 'tag', value: tag.name },
                        }}
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </CardActions>
      </Card>
      <ArticleActions
        lang={lng}
        article={article}
        isFullscreen={isFullscreen}
      />
      {!isFullscreen && <CommentList articleId={article.id} lang={lng} />}
      {!isFullscreen && hasArticles && (
        <>
          <Typography component='div'>{t('recommendation')}</Typography>
          <Articles lang={lng} articles={articles} loading={isFetching} />
        </>
      )}
    </>
  );
}
