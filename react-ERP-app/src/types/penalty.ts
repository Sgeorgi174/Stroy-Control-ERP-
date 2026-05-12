import type { User } from "./user";
import type { Object } from "./object"; // Предполагаю название вашей модели объекта
import type { Employee } from "./employee";

export type PenaltyStatus =
  | "PENDING"
  | "APPROVED"
  | "PROCESSED"
  | "REJECTED"
  | "CANCELED";

export interface EmployeePenalty {
  id: string;
  createdAt: string;
  updatedAt: string;
  amount: number;
  reason: string;
  description: string | null;
  status: PenaltyStatus;
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

  comments: RequestPenaltyComment[];
}

export interface EmployeePenaltyStats {
  totalAmount: number;
  count: number;
  pendingAmount: number;
  processedAmount: number;
}

export interface RequestPenaltyComment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: User;
  userId: string;

  request: EmployeePenalty;
  requestId: string;

  isSystemComment: boolean;
}
