import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { Position, Statuses } from 'generated/prisma';

export class GetEmployeeQueryDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  @IsEnum(Statuses)
  status?: Statuses;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;
}
