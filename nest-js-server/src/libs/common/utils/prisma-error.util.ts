import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

export function handlePrismaError(
  error: unknown,
  options: {
    notFoundMessage?: string;
    conflictMessage?: string;
    defaultMessage?: string;
  } = {},
): never {
  const {
    notFoundMessage = 'Запись не найдена',
    conflictMessage = 'Нарушение уникальности',
    defaultMessage = 'Внутренняя ошибка сервера',
  } = options;

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundException(notFoundMessage);
      case 'P2002':
        throw new ConflictException(conflictMessage);
    }
  }

  throw new InternalServerErrorException(defaultMessage);
}
