import type { Positions } from "../employee";

export type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  fatherName?: string;
  phoneNumber: string;
  clothingSizeId: string;
  footwearSizeId: string;
  clothingHeightId: string;
  position: Positions;
  objectId?: string;
  skillIds?: string[];

  passportSerial: string;
  passportNumber: string;
  whereIssued: string;
  issueDate: string;
  registrationRegion: string;
  registrationCity: string;
  registrationStreet: string;
  registrationBuild: string;
  registrationFlat: string | undefined;
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

  passportSerial: string;
  passportNumber: string;
  whereIssued: string;
  issueDate: string;
  registrationRegion: string;
  registrationCity: string;
  registrationStreet: string;
  registrationBuild: string;
  registrationFlat: string | undefined;
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

export type ChangeDebtDto = {
  debt: number;
};
