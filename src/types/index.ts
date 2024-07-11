export type User = {
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
    username: string;
    createdAt: Date;
    categories: {id: number, name: string}[]
};