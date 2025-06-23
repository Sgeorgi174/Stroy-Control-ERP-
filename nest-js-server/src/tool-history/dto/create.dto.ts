import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

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
}
