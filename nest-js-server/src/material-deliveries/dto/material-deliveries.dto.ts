import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateMaterialDeliveryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  objectId: string;
}

export class UpdateMaterialDeliveryDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    // Если данные пришли через FormData, массив ссылок может стать строкой
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value]; // на случай, если пришла одна строка не в JSON
      }
    }
    return value;
  })
  existingPhotos?: string[];
}
