import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmployeeDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional() // Теперь дата может быть пустой
  expDate?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isIndefinite?: boolean;

  @IsString()
  @IsOptional()
  docSrc?: string; // Опционально для обновления

  @IsOptional()
  @IsString()
  comment?: string;
}
