import type { Positions } from "@/types/employee";

export interface EmployeeSelection {
  id: string;
  selected: boolean;
  workedHours: number | null;
  firstName: string;
  lastName: string;
  position: Positions;
  task?: string;
  fatherName: string;
  absenceReason?: string;
  isLocal: boolean;
}
