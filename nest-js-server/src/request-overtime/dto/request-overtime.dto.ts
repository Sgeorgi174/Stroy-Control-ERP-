import { OvertimeStatus } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateEmployeeOvertimeDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  objectId!: string;

  @IsNumber({}, { message: 'Количество часов должно быть числом' })
  @Min(0.5, { message: 'Минимальное количество часов: 0.5' })
  hours!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;
}

export class UpdateEmployeeOvertimeDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  hours?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GetOvertimeFilterDto {
  @IsOptional()
  @IsEnum(OvertimeStatus)
  status?: OvertimeStatus;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}

export class CreateOvertimeCommentDto {
  @IsString()
  text!: string;
}
