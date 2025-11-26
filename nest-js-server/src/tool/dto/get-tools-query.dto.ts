import { ToolStatus } from '@prisma/client';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetToolsQueryDto {
  @IsOptional()
  @IsString()
  objectId?: string;

  @IsOptional()
  @IsEnum(ToolStatus)
  status?: ToolStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsString()
  isBulk?: string;

  @IsOptional()
  @IsBooleanString()
  includeAllStatuses?: string; // 'true' | 'false'
}
