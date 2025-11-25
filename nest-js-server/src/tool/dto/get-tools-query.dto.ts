import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ToolStatus } from 'generated/prisma';

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
