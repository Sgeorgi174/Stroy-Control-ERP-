import type { Object } from "./object";
import type { User } from "./user";

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

export type ArchiveRecord = {
  id: string;
  comment: string;
  archivedAt: string;
  changedBy: User;
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
  objectId: string;
  workPlace: Object | null;
  status: EmployeeStatuses;
  skills: Skill[];
  type: EmployeeType;
  archive: ArchiveRecord | null;
};
