import { IsNotEmpty, IsString } from 'class-validator';

export class RetransferClothesDto {
  @IsNotEmpty()
  @IsString()
  toObjectId: string;
}
