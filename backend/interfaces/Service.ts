export interface IService {
  id?: number;
  name: string;
  description: string;
  requestedFiles: string[];
  coverImage: string;
  price: number;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
} 