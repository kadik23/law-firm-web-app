// types/entities/Comment.ts
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
    likesCount: number;
    createdAt: string; 
    updatedAt: string; 
}