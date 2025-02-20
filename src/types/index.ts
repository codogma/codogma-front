import { ReactNode } from 'react';

export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_AUTHOR = 'ROLE_AUTHOR',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export enum Language {
  EN = 'en',
  RU = 'ru',
}

export enum SearchType {
  CONTENT = 'content',
  INFO = 'info',
  TAG = 'tag',
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  ARTICLE_MODERATION = 'ARTICLE_MODERATION',
  COMMENT_MODERATION = 'COMMENT_MODERATION',
  COMMENT_REPLIED = 'COMMENT_REPLIED',
  ARTICLE_COMMENTED = 'ARTICLE_COMMENTED',
  ARTICLE_PUBLISHED = 'ARTICLE_PUBLISHED',
  ARTICLE_DRAFT = 'ARTICLE_DRAFT',
  REMINDER = 'REMINDER',
}

export type GetUserDTO = {
  id: number;
  username: string;
  isSubscribed: boolean;
  email: string;
  firstName: string;
  lastName: string;
  shortInfo: string;
  bio: string;
  role: UserRole;
  avatarUrl: string;
  categories: GetCategory[];
};

export type User = {
  username: string;
  isSubscribed: boolean;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  role: UserRole;
  subscribers: User[] | [];
  subscriptions: User[] | [];
  favorites: GetCategory[] | [];
  avatarUrl: string;
  articles: Article[] | [];
  categories: GetCategory[];
  shortInfo: string;
};

export type GetTag = {
  id: number;
  name: string;
};

export type GetCategory = {
  id: number;
  isFavorite: boolean;
  name: string;
  description: string;
  imageUrl: string;
  tags: GetTag[];
};

export type GetCategoryToUpdate = {
  name: Record<Language, string>;
  description: Record<Language, string>;
  imageUrl: string;
};

export type GetNotificationToUpdate = {
  title: Record<Language, string>;
  message: Record<Language, string>;
};

export type GetCompilation = {
  id: number;
  isBookmarked: boolean;
  bookmarksCount: number;
  title: string;
  description: string;
  ownerName: string;
  ownerAvatarUrl: string;
  imageUrl: string;
};

export type GetNotification = {
  id: number;
  articleId: number;
  commentId: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
};

export type Article = {
  id: number;
  status: string;
  title: string;
  isBookmarked: boolean;
  language: Language;
  originalArticleId: number;
  previewContent: string;
  previewContentNode?: ReactNode;
  content: string;
  contentNode?: ReactNode;
  username: string;
  authorAvatarUrl: string;
  createdAt: Date;
  categories: GetCategory[];
  compilations: GetCompilation[];
  tags: GetTag[];
  commentsCount: number;
  likeCount: number;
  isLiked: boolean;
  isCompilated: boolean;
};

export interface GetComment {
  id: number;
  content: string;
  article: Article;
  parentCommentId?: number;
  user: User;
  replies?: GetComment[];
  createdAt: Date;
  updatedAt: Date;
}

export type GetCommentsDTO = {
  totalElements: number;
  totalPages: number;
  content: GetComment[];
};

export interface CreateComment {
  content: string;
  articleId: number;
  parentCommentId?: number;
}

export interface UpdateComment {
  content: string;
}
