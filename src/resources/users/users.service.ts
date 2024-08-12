import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User as IUserModel, Role } from '@prisma/client'
import { PrismaService } from 'src/adapters/config/prisma.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService
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

  async findAll(queryParams: { limit: number; skip: number }): Promise<[number, IUserModel[]]> {
    // 👷‍♂️ needed the total count for pagination but prisma has no inbuilt count option. Running an atomic operation like a transaction is a way around
    return this.prismaService.$transaction([
      this.prismaService.user.count(),
      this.prismaService.user.findMany({
        take: queryParams.limit,
        skip: queryParams.skip,
      }),
    ])
  }

  async createUser(data: CreateUserDto) {
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
