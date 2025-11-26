import { TabletStatus } from '@prisma/client';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class GetTabletsQueryDto {
  @IsOptional()
  @IsEnum(TabletStatus)
  status?: TabletStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
