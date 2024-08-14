import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User as IUserModel, Role } from '@prisma/client'
import { PrismaService } from 'src/adapters/config/prisma.service'
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { LoggerService } from 'src/global/logger/logger.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService
  ) { }
  async findOne(email: string) {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        email: email,
      },
    })
  }

  async findOneByID(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    })
  }

  async findAll({ limit, skip, role }: Partial<PaginationQueryDto>) {
    // 👷‍♂️ needed the total count for pagination but prisma has no inbuilt count option. Running an atomic operation like a transaction is a way around
    try {
      const where: { role: Role | undefined } = {
        role: undefined
      };
      if (role) {
        where["role"] = role;
      }

      const query: { where: typeof where, take?: number, skip?: number } = { where };
      if (skip) {
        query["skip"] = skip;
        query["take"] = (limit ?? 0) * (skip - 1);
      }

      const [total, users] = await this.prismaService.$transaction([
        this.prismaService.user.count({ where }),
        this.prismaService.user.findMany(query),
      ]);

      return {
        total,
        users,
        page: limit,
        perPage: skip,
      }

    } catch (error) {
      this.logger.error("Error fetching users", UsersService.name)
      throw new NotFoundException("No users found")
    }
  }

  //TODO: use the right Type here insted of any
  async createUser(data: any) {
    const user = await this.prismaService.user.create({
      data: data,
    })

    return user
  }

  async updateUser(id: string, update: Partial<CreateUserDto>) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...update,
      },
    })
  }

  async updatedRole(id: string, role: Role) {
    return this.updateUser(id, { role })
  }
}
