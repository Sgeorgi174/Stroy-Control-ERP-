import type {
  Countries,
  EmployeeStatuses,
  EmployeeType,
  Positions,
} from "../employee";

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
  country: Countries;
  passportSerial: string;
  passportNumber: string;
  whereIssued: string;
  issueDate: string;
  registrationRegion: string;
  registrationCity: string;
  registrationStreet: string;
  startWorkDate: string;
  registrationBuild: string;
  registrationFlat: string | undefined;
  dob: string;
  type?: EmployeeType;
  status?: EmployeeStatuses;
};

export type UpdateEmployeeDto = {
  firstName: string;
  lastName: string;
  fatherName?: string;
  phoneNumber: string;
  clothingSizeId: string;
  footwearSizeId: string;
  clothingHeightId: string;
  position: Positions;
  objectId?: string;
  country: Countries;
  passportSerial: string;
  passportNumber: string;
  whereIssued: string;
  issueDate: string;
  registrationRegion: string;
  registrationCity: string;
  registrationStreet: string;
  registrationBuild: string;
  startWorkDate: string;
  registrationFlat: string | undefined;
  dob: string;
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
  debt: string;
};
