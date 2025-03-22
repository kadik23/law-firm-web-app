interface avisEntity {
  id: number;
  feedback: string;
  createdAt: string;
  serviceId?: number;
  user: {
    name: string;
  };
  userId: number;
  image?: string;
}
