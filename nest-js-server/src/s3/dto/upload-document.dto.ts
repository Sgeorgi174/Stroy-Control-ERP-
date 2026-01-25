// dto/upload-document.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  folder: string; // например: employees/123/documents

  @IsString()
  @IsNotEmpty()
  filename: string; // например: passport
}
