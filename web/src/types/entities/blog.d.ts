interface Blog {
    id: number;
    title: string;
    author: string;
    content: string;
    likes: number;
    date: Date;
    readingDuration: number; // milliseconds
    image: string;
    category: string;
}