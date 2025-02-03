interface Blog {
    id: number;
    title: string;
    author: string;
    body: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    readingDuration: number; 
    image: string;
    categoryId: number;
}