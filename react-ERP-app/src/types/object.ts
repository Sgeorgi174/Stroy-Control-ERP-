import type { User } from "./user";

export type Object = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  userId: string | null;
  user: User | null;
  employees: number;
};
