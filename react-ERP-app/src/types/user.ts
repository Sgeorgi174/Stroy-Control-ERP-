import type { Object } from "./object";

export type Role =
  | "OWNER"
  | "MASTER"
  | "ACCOUNTANT"
  | "FOREMAN"
  | "ADMIN"
  | "ASSISTANT_MANAGER"
  | "HR";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  primaryObjects: Object[];
  secondaryObjects: Object[];
  objectId: string | null;
  createdAt: string;
};
