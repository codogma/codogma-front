export type User = {
    id: number,
    username: string;
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
    userId: number;
    createdAt: Date;
};