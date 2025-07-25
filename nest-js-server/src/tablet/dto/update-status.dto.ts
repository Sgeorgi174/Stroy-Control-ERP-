import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TabletStatus } from 'generated/prisma';

export class UpdateTabletStatusDto {
  @IsEnum(TabletStatus)
  @IsNotEmpty()
  status: TabletStatus;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
