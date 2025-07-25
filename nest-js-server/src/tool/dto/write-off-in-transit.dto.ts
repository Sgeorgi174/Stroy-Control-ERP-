import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToolStatus } from 'generated/prisma';

export class WriteOffToolInTransferDto {
  @IsEnum(ToolStatus, {
    message: `Статус должен быть одним из: ${Object.values(ToolStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Новый статус обязателен' })
  status: ToolStatus;

  @IsNotEmpty({ message: 'Коментарий обязателен' })
  @IsString()
  comment: string;
}
