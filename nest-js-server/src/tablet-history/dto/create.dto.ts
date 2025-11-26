import { TabletStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  tabletId: string;

  @IsEnum(TabletStatus)
  @IsOptional()
  fromStatus?: TabletStatus;

  @IsEnum(TabletStatus)
  @IsOptional()
  toStatus?: TabletStatus;

  @IsUUID()
  @IsOptional()
  fromEmployeeId?: string;

  @IsUUID()
  @IsOptional()
  toEmployeeId?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
