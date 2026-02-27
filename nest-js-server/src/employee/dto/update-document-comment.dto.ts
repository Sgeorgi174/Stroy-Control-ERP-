import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateDocumentCommentDto {
  @IsString()
  @IsOptional()
  @MaxLength(500) // Опционально: ограничим длину
  comment: string;
}
