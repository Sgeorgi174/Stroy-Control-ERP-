import type { Positions } from "../employee";

export type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  fatherName?: string;
  phoneNumber: string;
  clothingSize: number;
  footwearSize: number;
  position: Positions;
  objectId?: string;
  skillIds?: string[];
};

export type UpdateEmployeeDto = {
  firstName: string;
  lastName: string;
  fatherName?: string;
  phoneNumber: string;
  clothingSize: number;
  footwearSize: number;
  position: Positions;
  objectId?: string;
};

export type TransferEmployeeDto = {
  objectId: string;
};

export type AssignEmployeesDto = {
  employeeIds: string[];
  objectId: string;
};

export type AddSkillsDto = {
  skillIds: string[];
};

export type RemoveSkillDto = {
  skillId: string;
};

export type ArchiveDto = {
  comment: string;
};
