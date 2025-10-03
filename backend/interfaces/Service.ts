export interface IService {
  id?: number;
  name: string;
  description: string;
  requestedFiles: string[];
  coverImage: string;
  file_id: string;
  price: number;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
} 