import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { User, Role } from '@prisma/client';

// this makes the service available to all requests.
// and the service is singleton/unique.This is request safe.
@Injectable({ scope: Scope.REQUEST })
export class RequestService {

  constructor(
    private prismaService: PrismaService,
  ) { }

  private userId: string;

  async getUserWithSub(payload: { user_first_name: string, user_email: string, sub: string, org_role: string }) {

    const existingUser = <User>await this.prismaService.user.findUnique({
      where: { id: payload?.sub },
      select: {
        role: true,
        id: true,
        email: true,
        company_id: true,
        first_name: true,
      },
    });

    let userRole: Role = Role.ADG;
    if (payload?.org_role) userRole = Role.PDG;


    const user: Partial<User> = {
      id: existingUser?.id ?? payload?.sub,
      email: existingUser?.email ?? payload?.user_email,
      first_name: existingUser?.first_name ?? payload?.user_first_name,
      role: existingUser?.role ?? userRole,
      company_id: existingUser?.company_id ?? "",
    };

    return user;
  }

  set currentUserId(userId: string) {
    this.userId = userId;
  }

  get currentUserId() {
    return this.userId;
  }
}
