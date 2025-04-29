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
}

type LawyerFormData = Omit<
  avocatEntity & User,
  | "selected"
  | "pays"
  | "ville"
  | "age"
  | "sex"
  | "type"
  | "feedback"
  | "createdAt"
  | "serviceId"
  | "user"
  | "user_id"
  | "phone_number"
  | "date_membership"
  | "picture_path"
>;