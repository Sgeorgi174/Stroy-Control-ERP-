import { IsString } from 'class-validator';

export class UpdateAdditionalStorageDto {
  @IsString()
  name: string;
}
