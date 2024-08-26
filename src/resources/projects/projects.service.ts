import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationProjectQueryDto } from './dto/paginate-project.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';

@Injectable()
export class ProjectsService {
  private readonly logger = new LoggerService(ProjectsService.name);

  constructor(private readonly prismaService: PrismaService) { }

  @UseGuards(RolesGuard)
  async create(createProjectDto: Prisma.ProjectCreateInput) {
    return this.prismaService.project.create({
      data: createProjectDto,
    });
  }

  async findAll(query: Partial<PaginationProjectQueryDto>) {

    // find all the project with the latest start date with its status and type
    const [total, projects] = await this.prismaService.$transaction([
      this.prismaService.project.count(),
      this.prismaService.project.findMany({
        where: {
          status: query.status,
          type: query.type
        },
        take: query.page,
        skip: (query.page ?? 0) * (query.perPage ?? 20 - 1),
        orderBy: {
          startDate: 'desc',
        }
      })
    ]);

    return {
      total,
      data: projects,
      page: query.page ?? 0,
      perPage: query.perPage ?? 20,
      totalPages: Math.ceil(total / (query.perPage ?? 20))
    }
  }

  async findOne(id: string) {
    return this.prismaService.project.findUnique({
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't find a project with id ", ProjectsService.name);
      throw new NotFoundException("Can't find a project with id " + id);
    });
  }

  async update(id: string, updateProjectDto: Prisma.ProjectUpdateInput) {
    return this.prismaService.project.update({
      data: updateProjectDto,
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't update a project with id " + id, ProjectsService.name);
      throw new InternalServerErrorException("Can't update a project with id " + id);
    });
  }

  async remove(id: string) {
    return this.prismaService.project.delete({
      where: {
        id
      }
    }).catch((err) => {
      this.logger.error("Can't delete a project with id " + id, ProjectsService.name);
      throw new InternalServerErrorException("Can't delete a project with id " + id);
    });
  }
}
