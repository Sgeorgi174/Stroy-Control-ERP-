import type { PenaltyStatus } from "../penalty";

export interface CreateEmployeePenaltyDto {
  employeeId: string;
  objectId: string;
  amount: number;
  reason: string;
  description?: string;
  date: string
}

export type UpdateEmployeePenaltyDto = Partial<CreateEmployeePenaltyDto>;

export interface GetPenaltyFilterDto {
  employeeId?: string;
  objectId?: string;
  status?: PenaltyStatus;
  startDate?: string;
  endDate?: string;
}