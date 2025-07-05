import { IsNotEmpty, IsString } from 'class-validator';

export class RejectDeviceTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
