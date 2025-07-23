export interface ITestimonial {
  id?: number;
  userId: number;
  serviceId: number;
  feedback: string;
  createdAt?: Date;
  updatedAt?: Date;
} 