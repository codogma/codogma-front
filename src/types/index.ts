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