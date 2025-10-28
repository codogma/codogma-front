import { AdapterUser } from '@auth/core/adapters';
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

export interface AuthDTO extends AdapterUser {
  role: UserRole;
  expires: string;
}

export interface GetUserDTO {
  id: string;
  username: string;
  isSubscribed: boolean;
  email: string;
  bannerUrl?: string;
  firstName?: string;
  lastName?: string;
  shortInfo?: string;
  bio?: string;
  role: UserRole;
  avatarUrl?: string;
  categories: GetCategory[];
  subscribers: GetUserDTO[] | [];
  subscriptions: GetUserDTO[] | [];
  favorites: GetCategory[] | [];
  articles: GetArticle[] | [];
}

export type GetTag = {
  id: number;
  name: string;
};

export type GetCategory = {
  id: number;
  isFavorite: boolean;
  name: string;
  description: string;
  icon: GetImage;
  image: GetImageWithPalette;
  tags: GetTag[];
};

export type GetCategoryToUpdate = {
  name: Record<Language, string>;
  description: Record<Language, string>;
  image: GetImageWithPalette;
  icon: GetImage;
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
  createdAt: Date;
  articles: GetArticle[];
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

export type SwatchDTO = {
  r: number;
  g: number;
  b: number;
  population: number;
  h: number;
  s: number;
  l: number;
  hex: string;
  titleTextColor: string;
  bodyTextColor: string;
};

export type PaletteDTO = {
  vibrant: SwatchDTO | undefined;
  darkVibrant: SwatchDTO | undefined;
  lightVibrant: SwatchDTO | undefined;
  muted: SwatchDTO | undefined;
  darkMuted: SwatchDTO | undefined;
  lightMuted: SwatchDTO | undefined;
};

export type GetImage = {
  imageUrl: string;
  filename: string;
};

export type GetImageWithPalette = {
  imageUrl: string;
  filename: string;
  palette: PaletteDTO;
};

export type GetArticle = {
  id: number;
  status: string;
  title: string;
  isBookmarked: boolean;
  language: Language;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  originalArticleId: number;
  image: GetImageWithPalette;
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
  isLiked: boolean;
  isCompilated: boolean;
};

export interface GetComment {
  id: number;
  content: string;
  article: GetArticle;
  parentCommentId?: number;
  user: GetUserDTO;
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
