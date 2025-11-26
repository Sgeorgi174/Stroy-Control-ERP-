import { TabletStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTabletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsEnum(TabletStatus)
  @IsOptional()
  status?: TabletStatus;
}
