import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsString,
  IsBooleanString,
} from 'class-validator';
import { ToolStatus } from 'generated/prisma';

export class GetDeviceQueryDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  @IsEnum(ToolStatus)
  status?: ToolStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsOptional()
  @IsBooleanString()
  includeAllStatuses?: string; // 'true' | 'false'
}
