import { Transform } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsArray } from 'class-validator';
import { employeeType, Statuses } from 'generated/prisma';

export class GetEmployeeQueryDto {
  @IsOptional()
  @IsString()
  objectId?: string;

  @IsOptional()
  @IsEnum(Statuses)
  status?: Statuses;

  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(employeeType)
  type?: employeeType;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.split(','))
  @IsArray()
  skillIds?: string[];
}
