export interface IServiceFilesUploaded {
  id?: number;
  request_service_id: number;
  status: 'Accepted' | 'Pending' | 'Refused';
  file_name: string;
  rejection_reason?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} 