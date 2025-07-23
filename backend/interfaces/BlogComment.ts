export interface IBlogComment {
  id?: number;
  body: string;
  userId: number;
  blogId: number;
  createdAt?: Date;
  isAReply: boolean;
  originalCommentId?: number;
} 