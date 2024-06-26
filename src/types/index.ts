export type User = {
    id: number,
    username: string;
    posts: Post[] | [];
}

export type Genre = {
    id: number,
    name: string;
    books: Post[] | [];
}

export type Post = {
    id: number;
    title: string;
    content: string;
    userId: number;
};