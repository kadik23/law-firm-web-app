export interface IRequestService {
  id?: number;
  clientId: number;
  serviceId: number;
  status: 'Completed' | 'Pending' | 'Canceled';
  is_paid: boolean;
} 