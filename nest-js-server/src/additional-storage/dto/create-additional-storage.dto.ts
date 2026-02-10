import { IsString } from 'class-validator';

export class CreateAdditionalStorageDto {
  @IsString()
  name: string;
}
