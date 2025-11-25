import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateShiftDto {
  @IsDateString()
  @IsNotEmpty()
  shiftDate: string; // ISO date

  @IsInt()
  @IsNotEmpty()
  plannedHours: number;

  @IsString()
  @IsNotEmpty()
  objectId: string;

  @IsArray()
  @IsNotEmpty()
  employees: Array<{
    employeeId: string;
    workedHours: number;
    present: boolean;
    absenceReason?: string;
    task?: string;
    isLocal: boolean;
  }>;
}
