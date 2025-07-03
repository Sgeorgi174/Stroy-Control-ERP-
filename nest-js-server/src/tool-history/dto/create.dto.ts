import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ToolActions } from 'generated/prisma';

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
}
