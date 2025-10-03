export interface IBlog {
  id?: number;
  title: string;
  likes: number;
  body: string;
  readingDuration: number;
  image: string;
  file_id: string;
  categoryId: number;
  userId: number;
  accepted: boolean;
  rejectionReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} 