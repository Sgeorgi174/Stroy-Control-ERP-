import { IsNotEmpty, IsString } from 'class-validator';

export class WriteOffClothesInTransferDto {
  @IsNotEmpty({ message: 'Коментарий обязателен' })
  @IsString()
  comment: string;
}
