import {
  IsString,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateWorkLogItemDto {
  @IsString()
  text: string;
}

export class CreateWorkLogDto {
  @IsDateString()
  date: string;

  @IsUUID()
  objectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkLogItemDto)
  items: CreateWorkLogItemDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[]; // Массив URL-адресов после загрузки в S3
}
