import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSentItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  decsription?: string;
}
