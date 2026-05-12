import type { OvertimeStatus } from "../overtime";

export interface CreateEmployeeOvertimeDto {
  employeeId: string;
  objectId: string;
  hours: number;
  description?: string;
  date: string;
}

export type UpdateEmployeeOvertimeDto = Partial<CreateEmployeeOvertimeDto>;

export interface GetOvertimeFilterDto {
  employeeId?: string;
  objectId?: string;
  status?: OvertimeStatus;
  startDate?: string;
  endDate?: string;
}
