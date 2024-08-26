import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationCompanyQueryDto } from "./dto/paginate-company.dto";
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/guards/auth.guard';

@Injectable()
export class ComapnyService {
  private readonly logger = new LoggerService(ComapnyService.name);

  constructor(private readonly prismaService: PrismaService) { }


  async create(createCompanyDto: Prisma.CompanyCreateInput) {
    return this.prismaService.company.create({
      data: createCompanyDto,
    });
  }

  async findAll(query: Partial<PaginationCompanyQueryDto>) {

    // find all the company with the latest start date with its status and type
    const [total, comapnies] = await this.prismaService.$transaction([
      this.prismaService.company.count(),
      this.prismaService.company.findMany({
        take: query.page,
        skip: (query.page ?? 0) * (query.perPage ?? 20 - 1),
        orderBy: {
          createdAt: 'desc',
        }
      })
    ])

    return {
      total,
      data: comapnies,
      page: query.page ?? 0,
      perPage: query.perPage ?? 20,
      totalPages: Math.ceil(total / (query.perPage ?? 20))
    }
  }

  async findOne(id: string) {
    return this.prismaService.company.findUnique({
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't find a company with id ", ComapnyService.name);
      throw new NotFoundException("Can't find a company with id " + id);
    });
  }

  async update(id: string, updateCompanyDto: Prisma.CompanyUpdateInput) {
    return this.prismaService.company.update({
      data: updateCompanyDto,
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't update a company with id " + id, ComapnyService.name);
      throw new InternalServerErrorException("Can't update a company with id " + id);
    });
  }

  async remove(id: string) {
    return this.prismaService.company.delete({
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't delete a company with id " + id, ComapnyService.name);
      throw new InternalServerErrorException("Can't delete a company with id " + id);
    });
  }
}
