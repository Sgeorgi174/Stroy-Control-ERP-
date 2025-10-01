import type { Employee } from "./employee";
import type { Object } from "./object";
import type { User } from "./user";

export interface ShiftEmployee {
  id: string;
  createdAt: string; // ISO дата
  updatedAt: string; // ISO дата

  shiftId: string;
  employeeId: string;

  workedHours: number;
  present: boolean;
  absenceReason?: string;
  task?: string;

  // Опционально можно включить полные данные сотрудника
  employee: Employee;
}

export interface Shift {
  id: string;
  createdAt: string; // ISO дата
  updatedAt: string; // ISO дата

  shiftDate: string; // ISO дата
  plannedHours: number;
  totalHours: number;

  objectId: string;
  object: Object;

  employees: ShiftEmployee[];

  updatedReason?: string;

  createdById: string;
  createdBy: User;
}
