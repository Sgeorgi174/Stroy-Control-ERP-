import type { User } from "./user";
import type { Object } from "./object";
import type { Employee } from "./employee";

export type OvertimeStatus =
  | "PENDING"
  | "APPROVED"
  | "PROCESSED"
  | "REJECTED"
  | "CANCELED";

export interface EmployeeOvertime {
  id: string;
  createdAt: string;
  updatedAt: string;
  hours: number; // Вместо amount
  description: string | null;
  status: OvertimeStatus;
  processedAt: string | null;

  employee: Employee;
  employeeId: string;

  object: Object;
  objectId: string;

  creator: User;
  creatorId: string;

  approver?: User;
  approverId?: string;

  accountant?: User;
  accountantId?: string;
  date: string;
  number: number;

  comments: EmployeeOvertimeComment[];
}

export interface EmployeeOvertimeStats {
  totalProcessedHours: number;
  totalPendingHours: number;
  history: EmployeeOvertime[];
}

export interface EmployeeOvertimeComment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: User;
  userId: string;
  overtimeId: string;
  isSystemComment: boolean;
}
