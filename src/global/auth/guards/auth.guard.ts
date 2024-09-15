import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';
import { Role } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new LoggerService(RolesGuard.name);
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // we make sure the user is connected and authenticated
    const { user } = context.switchToHttp().getRequest();

    // allow route access for public routes like : health check,
    if (!requiredRoles && !user) {
      this.logger.log('user allowed access to route handler', RolesGuard.name);
      return true;
    }
    if (!(requiredRoles && user)) {
      !user
        ? this.logger.error('user not authenticated', RolesGuard.name)
        : this.logger.error(
            'user not allowed access to route handler: no role attached',
            RolesGuard.name,
          );
      return false;
    }
    this.logger.log('user allowed access to route handler', RolesGuard.name);
    // we make sure the user has the right permissions concerning the handler target.
    return requiredRoles.includes(user.role);
  }
}
