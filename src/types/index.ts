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
    role: UserRole;
    avatarUrl: string;
    articles: Article[] | [];
}

export type Category = {
    id: number,
    name: string;
    articles: Article[] | [];
}

export type Article = {
    id: number;
    title: string;
    content: string;
    username: string;
    createdAt: Date;
    categories: { id: number, name: string }[]
};