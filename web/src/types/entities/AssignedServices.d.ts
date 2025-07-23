interface AssignedServicesEntity {
  id: number;
  serviceId: number;
  clientId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  User: {
    id: number;
    name: string;
    surname: string;
    email: string;
    pays: string;
  };
}
