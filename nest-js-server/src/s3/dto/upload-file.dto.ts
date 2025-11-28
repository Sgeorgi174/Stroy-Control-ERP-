import { IsString, Matches } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Папка может содержать только буквы, цифры, "-", "_" и "/"',
  })
  folder: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Имя файла может содержать только буквы, цифры, "-", "_"',
  })
  filename: string;
}
