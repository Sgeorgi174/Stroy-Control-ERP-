import { ObjectDocType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateObjectDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ObjectDocType)
  @IsNotEmpty()
  type: ObjectDocType;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsUUID()
  @IsNotEmpty()
  objectId: string;

  // Эти поля заполняются в контроллере после парсинга FormData
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Магия трансформации одиночной строки в массив
  toolIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Магия трансформации одиночной строки в массив
  deviceIds?: string[];
}

export class ObjectDocumentFilterDto {
  @IsOptional()
  @IsEnum(ObjectDocType)
  type?: ObjectDocType;

  @IsOptional()
  @IsString()
  search?: string;
}
