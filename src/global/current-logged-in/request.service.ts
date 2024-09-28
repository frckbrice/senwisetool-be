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

  async getUserWithSub({ user_first_name, user_email, sub, org_role }: { user_first_name: string, user_email: string, sub: string, org_role: string }) {

    console.log("inside constructing user: \n\n", { user_first_name, user_email, sub, org_role })
    const existingUser = <User>await this.prismaService.user.findUnique({
      where: { id: sub },
      select: {
        role: true,
        id: true,
        email: true,
        company_id: true,
        first_name: true,
      },
    });

    console.log("after checking for existing user constructing user: \n\n", existingUser)
    let userRole: Role = Role.ADG;
    if (org_role) userRole = Role.PDG;
    console.log("role: \n\n", userRole)
    const user: Partial<User> = {
      id: existingUser?.id ?? sub,
      email: existingUser?.email ?? user_email,
      first_name: existingUser?.first_name ?? user_first_name,
      role: existingUser?.role ?? userRole,
      company_id: existingUser?.company_id ?? "",
    };
    console.log("lastly this is the user: \n\n", user)
    return user;
  }

  set currentUserId(userId: string) {
    this.userId = userId;
  }

  get currentUserId() {
    return this.userId;
  }
}
