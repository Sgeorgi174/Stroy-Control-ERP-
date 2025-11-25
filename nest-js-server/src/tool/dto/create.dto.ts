import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsOptional()
  serialNumber: string;

  @IsString({ message: 'Серийный номер должен быть строкой' })
  @IsOptional()
  originalSerial: string;

  @IsNotEmpty()
  @IsBoolean()
  isBulk: boolean;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString({ message: 'object_id должен быть строкой' })
  @IsOptional()
  objectId?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;
}
