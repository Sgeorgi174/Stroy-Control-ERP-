import type { Object } from "./object";

export type Statuses = "OK" | "WARNING" | "OVERDUE";
export type Positions =
  | "FOREMAN"
  | "ELECTRICAN"
  | "LABORER"
  | "DESIGNER"
  | "ENGINEER";

export type Employee = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  clothingSize: number;
  footwearSize: number;
  position: Positions;
  workPlace: Object | null;
  status: Statuses;
};
