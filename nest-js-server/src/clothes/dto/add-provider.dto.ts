import { IsString, Length } from 'class-validator';

export class AddProviderDto {
  @IsString()
  @Length(2, 100)
  name: string;
}
