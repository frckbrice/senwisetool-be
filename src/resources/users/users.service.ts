import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { Prisma, Role, UserStatus } from '@prisma/client'
import { PrismaService } from 'src/adapters/config/prisma.service'
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { LoggerService } from 'src/global/logger/logger.service'

@Injectable()
export class UsersService {
  private readonly logger = new LoggerService(UsersService.name)
  constructor(
    private readonly prismaService: PrismaService,

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

  async findAll({ page, perPage, role }: Partial<PaginationQueryDto>) {
    // 👷‍♂️ needed the total count for pagination but prisma has no inbuilt count option. Running an atomic operation like a transaction is a way around
    try {
      const where: { role: Role | undefined } = {
        role: undefined
      };
      if (role) {
        where["role"] = role;
      }

      const query: { where: typeof where, take?: number, skip?: number, orderBy?: Prisma.UserOrderByWithRelationInput & { createdAt: "desc" | "asc" } } = { where };
      if (perPage) {
        query["take"] = perPage;
        query["skip"] = (page ?? 0) * (perPage - 1);
      }
      query["orderBy"] = {
        createdAt: "desc",
      }
      const [total, users] = await this.prismaService.$transaction([
        this.prismaService.user.count({ where }),
        this.prismaService.user.findMany(query),
      ]);

      return {
        total,
        users,
        page,
        perPage,
      }

    } catch (error) {
      this.logger.error("Error fetching users", UsersService.name)
      throw new NotFoundException("No users found")
    }
  }

  //TODO: use the right Type here insted of any
  async createUser(data: {
    user_id: string,
    user_email: string,
    first_name: string,
  }) {

    try {
      // check first if the user already exist before creating newuser

      const user = await this.prismaService.user.findUnique({
        where: {
          id: data.user_id,
        }
      })

      if (user?.id)
        return {
          status: 409,
          message: "User already exists",
          data: user
        }
      else {
        const newUSer = await this.prismaService.user.create({
          data: {
            id: data.user_id,
            first_name: data.first_name,
            email: data.user_email,
            role: Role.EMPLOYEE,
            company_id: "",
            phone_number: null,
            username: null,
            status: UserStatus.ACTIVE,
            famer_attached_contract_url: null,
            last_name: null,
            profileUrls: null,
          },
        })

        if (newUSer && newUSer.id) {
          return {
            status: 201,
            message: "User created successfully",
            data: newUSer
          }
        } else {
          return {
            status: 404,
            message: "User not found",
            data: null
          }
        }

      }

    } catch (error) {
      this.logger.error(`error creating the user: ${error}`, UsersService.name)
      throw new InternalServerErrorException("Failed to create user")
    }
  }

  async updateUser(id: string, update: Partial<CreateUserDto>) {
    return this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...update,
      },
    }).catch((error) => {
      this.logger.error("Error updating user", UsersService.name)
      throw error
    })
  }

  async updatedRole(id: string, role: Role) {
    return this.updateUser(id, { role })
  }

  async remove(id: string) {
    return this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }
}
