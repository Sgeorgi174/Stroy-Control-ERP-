import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateShiftTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  }>;
}
