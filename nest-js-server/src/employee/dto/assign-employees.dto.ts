import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AssignEmployeesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  employeeIds: string[];

  @IsUUID()
  objectId: string;
}
