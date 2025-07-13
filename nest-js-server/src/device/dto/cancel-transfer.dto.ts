import { IsNotEmpty, IsString } from 'class-validator';

export class CancelDeviceTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
