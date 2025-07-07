// dto/get-transfers-filter.dto.ts
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { PendingStatuses } from 'generated/prisma';

export class QueryTransfersFilterDto {
  @IsOptional()
  @IsEnum(PendingStatuses)
  status?: PendingStatuses;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value === 'all' ? undefined : value,
  )
  fromObjectId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value === 'all' ? undefined : value,
  )
  toObjectId?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string; // ожидается дата в формате 'YYYY-MM-DD'
}
