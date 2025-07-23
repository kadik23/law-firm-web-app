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
}

import { Request } from 'express';
declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
} 