import { IsNotEmpty, IsString } from 'class-validator';

export class RequestTransferPhotoDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
