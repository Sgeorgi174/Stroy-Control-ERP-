import { IsString, Length } from 'class-validator';

export class UpdateProviderDto {
  @IsString()
  @Length(2, 100)
  name: string;
}
