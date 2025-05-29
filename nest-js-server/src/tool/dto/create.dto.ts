import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Status {
  ON_OBJECT = 'ON_OBJECT',
  IN_TRANSIT = 'IN_TRANSIT',
}

export class CreateDto {
  @IsString({ message: 'Название инструмента должно быть строкой' })
  @IsNotEmpty({ message: 'Название инструмента обязательно для заполнения.' })
  name: string;

  @IsEnum(Status, {
    message: `Статус должен быть одним из: ${Object.values(Status).join(', ')}`,
  })
  @IsOptional()
  status?: Status;

  @IsString({ message: 'Серийный номер должен быть строкой' })
  @IsNotEmpty({ message: 'Серийный номер обязателен для заполнения.' })
  serialNumber: string;

  @IsString({ message: 'object_id должен быть строкой' })
  @IsNotEmpty({ message: 'object_id обязателен для заполнения.' })
  objectId: string;
}
