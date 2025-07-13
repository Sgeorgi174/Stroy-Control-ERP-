import { IsNotEmpty, IsString } from 'class-validator';

export class RejectClothesTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
