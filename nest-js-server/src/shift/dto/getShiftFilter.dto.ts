import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class GetShiftsFilterDto {
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;

  @IsString()
  @IsOptional()
  objectId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  employeeIds?: string[];
}
