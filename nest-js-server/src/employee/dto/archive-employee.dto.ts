import { IsNotEmpty, IsString } from 'class-validator';

export class ArchiveDto {
  @IsString({ message: 'Коментарий должен быть строкой' })
  @IsNotEmpty()
  comment: string;
}
