import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform, TransformFnParams } from 'class-transformer';

class UpdateWorkLogItemDto {
  @IsString()
  text: string;
}

export class UpdateWorkLogDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkLogItemDto)
  @Transform(({ value }: TransformFnParams) => {
    // Если данные пришли через multipart/form-data, они будут строкой
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
    return value;
  })
  items?: UpdateWorkLogItemDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: TransformFnParams) => {
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  removedPhotoIds?: string[];
}
