export interface ShiftEmployeeDto {
  employeeId: string;
  workedHours: number;
  present: boolean;
  absenceReason?: string;
  task?: string;
  isLocal: boolean;
}

export interface CreateShiftDto {
  shiftDate: string; // ISO дата

  plannedHours: number;

  objectId: string;

  employees: ShiftEmployeeDto[];
}

export interface CreateShiftTemplateDto {
  name: string;

  plannedHours: number;

  objectId: string;

  employees: ShiftEmployeeDto[];
}

export interface UpdateShiftDto extends CreateShiftDto {
  updatedReason: string;
}

export interface UpdateShiftTemplateDto {
  name: string;

  plannedHours: number;

  objectId: string;

  employees: ShiftEmployeeDto[];
}

export interface GetShiftsFilterDto {
  fromDate?: string;

  toDate?: string;

  objectId?: string;

  employeeIds?: string[];
}
