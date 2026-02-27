import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TransferItemDto {
  @IsString()
  @IsNotEmpty()
  requestClothesId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class TransferToStorageDto {
  @IsString()
  @IsNotEmpty()
  objectId: string; // ID склада

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransferItemDto)
  items: TransferItemDto[];
}
