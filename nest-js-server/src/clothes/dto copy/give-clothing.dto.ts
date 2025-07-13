import { IsUUID, IsNotEmpty } from 'class-validator';

export class GiveClothingDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;
}
