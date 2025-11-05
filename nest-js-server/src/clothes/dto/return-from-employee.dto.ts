import { IsUUID, IsNotEmpty } from 'class-validator';

export class ReturnFromEmployeeDto {
  @IsUUID()
  @IsNotEmpty()
  objectId: string;

  @IsUUID()
  @IsNotEmpty()
  clothesId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeClothingId: string;
}
