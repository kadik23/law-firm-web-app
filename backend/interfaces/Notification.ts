export interface INotification {
  id?: number;
  type: 'Comments' | 'Consultation' | 'Documents' | 'Blogs';
  description: string;
  userId: number;
  entityId: number;
  isRead: boolean;
  createdAt?: Date;
} 