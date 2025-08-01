interface Blog {
    id: number;
    title: string;
    author: string;
    body: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    readingDuration: number; 
    image: string;
    categoryId: number;
    category: Category;
    rejectionReason: string | null;
    accepted: boolean;
}

type BlogFormData = Omit<
  Blog & Category,
  | "createdAt"
  | "updatedAt"
  | "id"
  | "selected"
>;