// dto/update-work-log.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkLogDto } from './create-work-log.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateWorkLogDto extends PartialType(CreateWorkLogDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return JSON.parse(value);
    return value;
  })
  existingPhotos?: string[]; // URL-ы фотографий, которые мы решили ОСТАВИТЬ
}
