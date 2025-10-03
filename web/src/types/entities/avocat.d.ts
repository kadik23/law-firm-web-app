interface avocatEntity{
    id?: number;
    user_id: string;
    status: string;
    linkedin_url: string;
    name: string;
    surname: string;
    certificats: string[];
    date_membership: string;
    picture_path: string;
    createdAt: string;
    updatedAt: string;
    picture: string | File;
    User?: User;
}

type LawyerFormData = Omit<
  avocatEntity & User,
  | "selected"
  | "type"
  | "feedback"
  | "createdAt"
  | "serviceId"
  | "user"
  | "user_id"
  | "date_membership"
  | "picture_path"
>;