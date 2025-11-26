import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { UserRoles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authorization(...roles: Roles[]) {
  if (roles.length > 0) {
    return applyDecorators(
      UserRoles(...roles),
      UseGuards(AuthGuard, RolesGuard),
    );
  }

  return applyDecorators(UseGuards(AuthGuard));
}
