import { IsNotEmpty, IsString } from 'class-validator';

export class RetransferToolDto {
  @IsNotEmpty()
  @IsString()
  toObjectId: string;
}
