import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ToolStatus } from 'generated/prisma';

export class CreateDto {
  @IsString({ message: 'Название инструмента должно быть строкой' })
  @IsNotEmpty({ message: 'Название инструмента обязательно для заполнения.' })
  name: string;

  @IsEnum(ToolStatus, {
    message: `Статус должен быть одним из: ${Object.values(ToolStatus).join(', ')}`,
  })
  @IsOptional()
  status?: ToolStatus;

  @IsString({ message: 'Серийный номер должен быть строкой' })
  @IsNotEmpty({ message: 'Серийный номер обязателен для заполнения.' })
  serialNumber: string;

  @IsString({ message: 'object_id должен быть строкой' })
  @IsNotEmpty({ message: 'object_id обязателен для заполнения.' })
  objectId: string;
}
