export interface INotification {
  id?: number;
  type: 'Comments' | 'Consultation' | 'Documents';
  description: string;
  userId: number;
  entityId: number;
  isRead: boolean;
  createdAt?: Date;
} 