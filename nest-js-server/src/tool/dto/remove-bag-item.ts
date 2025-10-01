import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveBagItemDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
