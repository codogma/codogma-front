export enum UserRole {
    ROLE_USER = "ROLE_USER",
    ROLE_AUTHOR = "ROLE_AUTHOR",
    ROLE_ADMIN = "ROLE_ADMIN"
}

export type User = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    role: UserRole;
    subscribers: User[] | [];
    avatarUrl: string;
    articles: Article[] | [];
    categories: Category[];
    shortInfo: string
}

export type Tag = {
    id: number,
    name: string;
}

export type Category = {
    id: number,
    name: string;
    description: string;
    imageUrl: string;
    tags: Tag[]
}

export type Article = {
    id: number;
    title: string;
    previewContent: string,
    content: string;
    username: string;
    authorAvatarUrl: string;
    createdAt: Date;
    categories: Category[]
    tags: Tag[]
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

export interface CreateComment {
    content: string;
    articleId: number;
    parentCommentId?: number;
}

export interface UpdateComment {
    content: string;
}