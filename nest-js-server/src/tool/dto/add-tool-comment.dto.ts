import { IsNotEmpty, IsString } from 'class-validator';

export class AddToolCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
