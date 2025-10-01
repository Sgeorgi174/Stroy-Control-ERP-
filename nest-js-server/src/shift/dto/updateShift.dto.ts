import { CreateShiftDto } from './createShift.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShiftDto extends CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  updatedReason: string;
}
