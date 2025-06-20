import type { User } from "./user";

export type Object = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  userId: string | null;
  foreman: User | null;
  employees: number;
};
