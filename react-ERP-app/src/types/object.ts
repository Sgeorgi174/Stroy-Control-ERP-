import type { Employee } from "./employee";
import type { User } from "./user";

export type ObjectStatus = "OPEN" | "CLOSE";

export type Object = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  userId: string | null;
  foreman: User | null;
  employees: Employee[];
  status: ObjectStatus;
};
