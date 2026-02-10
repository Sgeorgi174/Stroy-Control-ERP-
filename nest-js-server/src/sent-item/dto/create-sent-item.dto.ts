import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class CreateSentItemDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  description: string;

  @IsDateString()
  addedDay: string;

  @IsString()
  additionalStorageId: string;
}
