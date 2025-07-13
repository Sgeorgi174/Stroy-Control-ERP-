import { IsNotEmpty, IsString } from 'class-validator';

export class CancelClothesTransferDto {
  @IsNotEmpty()
  @IsString()
  rejectionComment: string;
}
