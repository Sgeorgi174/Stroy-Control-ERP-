import { ObjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetObjectQueryDto {
  @IsOptional()
  @IsEnum(ObjectStatus)
  status?: ObjectStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
