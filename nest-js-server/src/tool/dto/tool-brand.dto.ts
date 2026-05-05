// dto/create-brand.dto.ts
import { IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBrandDto {
  @IsString()
  @MinLength(2, { message: 'Название бренда слишком короткое' })
  name: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
