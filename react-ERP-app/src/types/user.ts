import type { Object } from "./object";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "OWNER" | "MASTER" | "ACCOUNTANT" | "FOREMAN";
  object: Object | null;
  objectId: string | null;
};

//  OWNER
//   MASTER
//   ACCOUNTANT
//   FOREMAN
