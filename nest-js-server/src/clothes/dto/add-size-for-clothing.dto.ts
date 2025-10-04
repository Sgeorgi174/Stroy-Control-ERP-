import { IsNotEmpty, IsString } from 'class-validator';

export class AddSizeForClothingDto {
  @IsString()
  @IsNotEmpty()
  size: string;
}
