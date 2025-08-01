export interface IUser {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone_number?: string;
  pays: string;
  ville?: string;
  age?: number;
  sex?: 'Homme' | 'Femme';
  terms_accepted: boolean;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
} 