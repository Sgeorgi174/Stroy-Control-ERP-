import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ObjectStatus } from 'generated/prisma';

export class GetObjectQueryDto {
  @IsOptional()
  @IsEnum(ObjectStatus)
  status?: ObjectStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
