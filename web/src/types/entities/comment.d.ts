<<<<<<< HEAD
// types/Comment.ts
=======
// types/entities/Comment.ts
>>>>>>> adbc2aee613c83e30b14ccc290b086763c8636c5
export interface Comment {
    id: number;
    userId?: number;
    user: {
        id?: number;
        name?: string;
        surname?: string;
    };
    blogId: number;
    body: string;
    likesCount: number;
    isAReply: number; 
    replies: number;
    originalCommentId: number | null; 
    createdAt: string; 
    updatedAt: string; 
}