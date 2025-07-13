import { IsNotEmpty, IsString } from 'class-validator';

export class CancelToolTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
