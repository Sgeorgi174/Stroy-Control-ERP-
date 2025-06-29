import type { Object } from "./object";

export type EmployeeStatuses = "OK" | "WARNING" | "OVERDUE" | "INACTIVE";
export type Positions =
  | "FOREMAN"
  | "ELECTRICAN"
  | "LABORER"
  | "DESIGNER"
  | "ENGINEER";

export type EmployeeType = "ACTIVE" | "ARCHIVE";

export type Skill = {
  id: string;
  skill: string;
};

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
  status: EmployeeStatuses;
  skills: Skill[];
  type: EmployeeType;
  archive: { id: string; comment: string; archivedAt: string } | null;
};
