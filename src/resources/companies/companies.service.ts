import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { CompanyStatus, Prisma, User } from '@prisma/client';
import { PaginationCompanyQueryDto } from "./dto/paginate-company.dto";
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { UsersService } from '../users/users.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ComapnyService {
  private readonly logger = new LoggerService(ComapnyService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private slugifyService: Slugify,
    private eventEmitter: EventEmitter2
  ) { }


  async create(createCompanyDto: Prisma.CompanyCreateInput, user: Partial<User>) {
    // avoid creating company twice

    const company = await this.prismaService.company.findFirst({
      where: {
        email: createCompanyDto.email
      }
    })
    if (company)
      return {
        data: company,
        status: 409,
        message: `Company ${createCompanyDto.name} already exists`
      }
    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const result = await this.prismaService.company.create({
          data: {
            ...createCompanyDto,
            slug: this.slugifyService.slugify(createCompanyDto.name),
            status: CompanyStatus.INACTIVE // has not yet subscribe to a price plan.
          },
        });

        // We create the user object here. This is a design decision. because we need to create the ADG along with its company. May be updated later.
        await this.userService.createUserFromCompany({
          id: <string>user.id,
          first_name: <string>user.first_name,
          email: <string>user.email,
          role: <string>user.role,
          company_id: <string>result.id,
        })
        this.logger.log(`start emitting company.created`, ComapnyService.name);
        // send message for company created in senwisetool system
        this.eventEmitter.emit('company.created', result)

        return result;
      })
      if (result)
        return {
          data: result,
          status: 201,
          message: `company created successfully`
        }
      else
        return {
          data: null,
          status: 500,
          message: `Failed to create company`
        }
    } catch (error) {

      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(`Error while creating company ${error.name}: Validation error \n\n ${error}`, ComapnyService.name);
        throw new InternalServerErrorException(`Validation Error while creating company ` + createCompanyDto.name);
      }
      this.logger.error(`Error while creating company ${createCompanyDto.name} \n\n ${error}`, ComapnyService.name);
      throw new InternalServerErrorException(`Error while creating company ` + createCompanyDto.name);
    }
  }

  async findAll(query: Partial<PaginationCompanyQueryDto>) {

    // find all the company with the latest start date with its status and type
    const { page, perPage } = query;
    let Query = Object.create({});
    Query = {
      ...Query,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        created_at: 'desc',
      }
    }
    // find all the companies
    try {
      const [total, comapnies] = await this.prismaService.$transaction([
        this.prismaService.company.count(),
        this.prismaService.company.findMany(Query)
      ]);
      if (comapnies.length)
        return {
          status: 200,
          message: "comapnies fetched successfully",
          data: comapnies,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
      else
        return {
          status: 400,
          message: "No comapnies found",
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
    } catch (error) {
      this.logger.error(`Error fetching comapnies \n\n ${error}`, ComapnyService.name);
      throw new NotFoundException("Error fetching comapnies");
    }
  }

  async findOne(company_id: string) {

    try {
      const result = await this.prismaService.company.findUnique({
        where: {
          id: company_id
        }
      })

      if (result)
        return {
          data: result,
          status: 200,
          message: `company fetched successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch company`
        }
    } catch (err) {
      this.logger.error("Can't find a company with id ", ComapnyService.name);
      throw new NotFoundException("Can't find a company with id " + company_id);
    };
  }

  async update(id: string, updateCompanyDto: Prisma.CompanyUpdateInput) {

    try {
      const result = await this.prismaService.company.update({
        data: updateCompanyDto,
        where: {
          id
        }
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `company updated successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update company`
        }
    } catch (err) {
      this.logger.error("Can't update a company with id " + id, ComapnyService.name);
      throw new InternalServerErrorException("Can't update a company with id " + id);
    };
  }

  async remove(company_id: string) {
    try {
      const result = await this.prismaService.company.delete({
        where: {
          id: company_id
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `company deleted successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete company`
        }
    } catch (err) {
      this.logger.error("Can't delete a company with company_id " + company_id, ComapnyService.name);
      throw new InternalServerErrorException("Can't delete a company with company_id " + company_id);
    };
  }


}
