interface serviceEntity{
    id?: number;
    coverImage: string;
    name: string;
    description: string;
    user_id?: string;
    price?: number;
    requestedFiles?: string[];
    request_service_id?: number;
    createdAt?: string;
    updatedAt?: string;
}

type ServiceFormData = Omit<
  serviceEntity,
  | "createdAt"
  | "updatedAt"
  | "request_service_id"
  | "user_id"
>;