import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AddBagItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
