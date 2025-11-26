import type { Clothes } from "./clothes";
import type { Device } from "./device";
import type { Employee } from "./employee";
import type { Tool } from "./tool";
import type { User } from "./user";

export type ObjectStatus = "OPEN" | "CLOSE";

export type Customer = {
  id: string;
  name: string;
  shortName?: string | null;
};

export type Object = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  address: string;
  userId: string | null;
  foreman: User | null;
  employees: Employee[];
  clothes: Clothes[];
  devices: Device[];
  tools: Tool[];
  status: ObjectStatus;
  isPending: boolean;
  customer: Customer;
};
