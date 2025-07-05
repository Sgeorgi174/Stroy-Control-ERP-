import { IsNotEmpty, IsString } from 'class-validator';

export class RejectToolTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
