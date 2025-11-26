import { ToolActions } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  toolId: string;

  @IsUUID()
  @IsOptional()
  fromObjectId?: string;

  @IsUUID()
  @IsNotEmpty()
  toObjectId: string;

  @IsEnum(ToolActions)
  @IsNotEmpty()
  action: ToolActions;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
