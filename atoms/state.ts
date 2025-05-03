import { atom } from 'jotai';


type UserType = {
    email: string;
    firstName: string;
    lastName: string;
  };

export const userAtom = atom<UserType | null>(null); // Stores user info (first name, last name, email)
