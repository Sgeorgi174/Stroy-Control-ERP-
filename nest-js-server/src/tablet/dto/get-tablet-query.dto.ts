import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TabletStatus } from 'generated/prisma';

export class GetTabletsQueryDto {
  @IsOptional()
  @IsEnum(TabletStatus)
  status?: TabletStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
