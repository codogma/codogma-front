enum Role {
    ROLE_USER = "ROLE_USER",
    ROLE_AUTHOR = "ROLE_AUTHOR",
    ROLE_ADMIN = "ROLE_ADMIN"
}

export type User = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    posts: Post[] | [];
}

export type Category = {
    id: number,
    name: string;
    posts: Post[] | [];
}

export type Post = {
    id: number;
    title: string;
    content: string;
    username: string;
    createdAt: Date;
    categories: { id: number, name: string }[]
};