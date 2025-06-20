import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { ToolStatus } from 'generated/prisma';

export class GetToolsQueryDto {
  @IsOptional()
  @IsUUID()
  objectId?: string;

  @IsOptional()
  @IsEnum(ToolStatus)
  status?: ToolStatus;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
