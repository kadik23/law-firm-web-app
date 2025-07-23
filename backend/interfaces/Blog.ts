export interface IBlog {
  id?: number;
  title: string;
  likes: number;
  body: string;
  readingDuration: number;
  image: string;
  categoryId: number;
  userId: number;
  accepted: boolean;
} 