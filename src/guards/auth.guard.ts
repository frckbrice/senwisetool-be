import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from './roles.decorator'
import { Role } from '@prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (!requiredRoles) { // to handle the case where and anonymous user may whant to access some part of the app.
            return true
        }
        // we make sure the user is connected and authenticated
        const { user } = context.switchToHttp().getRequest()
        if (!user) {
            return false
        }
        // we make sure the user has the right permissions concerning the handler target.
        return requiredRoles.includes(user.role)
    }
}
