import { TabletStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTabletStatusDto {
  @IsEnum(TabletStatus)
  @IsNotEmpty()
  status: TabletStatus;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
