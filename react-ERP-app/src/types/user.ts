import type { Object } from "./object";

export type Role = "OWNER" | "MASTER" | "ACCOUNTANT" | "FOREMAN";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  object: Object | null;
  objectId: string | null;
};
