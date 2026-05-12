import { PenaltyStatus } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateEmployeePenaltyDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  objectId!: string;

  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(1, { message: 'Сумма штрафа должна быть больше 0' })
  amount!: number;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;
}

export class UpdateEmployeePenaltyDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ChangePenaltyStatusDto {
  @IsEnum(PenaltyStatus, {
    message: 'Некорректный статус штрафа',
  })
  status!: PenaltyStatus;
}

export class GetPenaltyFilterDto {
  @IsOptional()
  @IsEnum(PenaltyStatus)
  status?: PenaltyStatus;

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

export class CreatePenaltyCommentDto {
  @IsString()
  text!: string;
}
