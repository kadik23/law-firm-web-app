interface NotificationType {
    id: number;
    type: string;
    title: string;
    content: string;
    blogName?: string;
    serviceName?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number;
        name: string;
        avatar: string;
    };
}