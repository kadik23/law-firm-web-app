interface NotificationType {
  id: number;
  type: "Comments" | "Consultation" | "Documents" | "Blogs" | "Payment";
  description: string;
  userId: number;
  entityId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  status?: string;
  // Optional related data that might be populated by joins
  blog?: {
    name: string;
  };
  service?: {
    name: string;
  };
  consultation?: {
    id: number;
    date: string;
    mode: "online" | "offline";
  };
  user?: {
    id: number;
    name: string;
  };
}

interface FilterValues {
  postTime: string;
  notificationType: string;
  consultationTime: string;
  consultationType: string;
}