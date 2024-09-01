import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, ProjectStatus, TypeProject } from '@prisma/client';
import { PaginationProjectQueryDto } from './dto/paginate-project.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Slugify } from 'src/global/utils/slugilfy';

@Injectable()
export class ProjectsService {
  private readonly logger = new LoggerService(ProjectsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private slugify: Slugify
  ) { }

  @UseGuards(RolesGuard)
  async create(createProjectDto: Prisma.ProjectCreateInput) {

    // avoid creating the same project twice

    const project = await this.prismaService.project.findFirst({
      where: {
        slug: this.slugify.slugify(createProjectDto.title),
      }
    })

    if (project)
      return {
        data: project,
        status: 409,
        message: `Project  ${createProjectDto.title} already exists`
      }

    // validate date so that end date should be greater than start date
    if (createProjectDto.start_date > createProjectDto.end_date)
      return {
        data: null,
        status: 400,
        message: `End date should be greater than or equal to start date`
      }

    try {
      const result = await this.prismaService.project.create({
        data: {
          ...createProjectDto,
          slug: this.slugify.slugify(createProjectDto.title),
        },
      });

      if (result)
        return {
          data: result,
          status: 201,
          message: `project created successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to create project`
        }
    } catch (error) {
      this.logger.error(`Error while creating project ${error}`, ProjectsService.name);
      throw new InternalServerErrorException(`Error while creating project`);
    }
  }

  async findAll(query: Partial<PaginationProjectQueryDto>) {

    const { status, type, page, perPage } = query;
    const where = Object.create({}); let Query = Object.create({ where });
    if (status) {
      where["status"] = status;
    }

    if (type) {
      where["type"] = type;
    }

    Query = {
      ...Query,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        start_date: 'desc',
      }
    }
    // find all the project with the latest start date with its status and type
    try {
      const [total, projects] = await this.prismaService.$transaction([
        this.prismaService.project.count(),
        this.prismaService.project.findMany(Query)
      ]);
      if (projects.length)
        return {
          status: 200,
          message: "projects fetched successfully",
          data: projects,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
      else
        return {
          status: 400,
          message: "No projects found",
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
    } catch (error) {
      this.logger.error("Error fetching projects", ProjectsService.name);
      throw new NotFoundException("Error fetching projects");
    }
  }

  async findOne(project_id: string) {

    const where = {} as {
      id: string | undefined, slug: string | undefined
    }
    if (project_id.includes('-')) {
      where["slug"] = project_id
    }
    else {
      where["id"] = project_id
    }

    try {
      const result = await this.prismaService.project.findUnique({
        where
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `project fetched successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch project`
        }
    } catch (err) {
      this.logger.error(`Can't find a project with project_id ${project_id} \n\n ${err}`, ProjectsService.name);
      throw new NotFoundException("Can't find a project with project_id " + project_id);
    };

  }

  async update(id: string, updateProjectDto: Prisma.ProjectUpdateInput) {

    try {
      const result = await this.prismaService.project.update({
        data: updateProjectDto,
        where: {
          id
        }
      });

      if (result)
        return {
          data: result,
          status: 200, // the resource is return to be used by the client
          message: `project updated successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update project`
        }
    } catch (err) {
      this.logger.error(`Can't update a project with id  ${id} \n\n ${err}`, ProjectsService.name);
      throw new InternalServerErrorException("Can't update a project with id " + id);
    };
  }

  async remove(project_id: string) {


    try {
      const result = await this.prismaService.project.delete({
        where: {
          id: project_id
        }
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `project deleted successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete project`
        }
    } catch (err) {
      this.logger.error("Can't delete a project with project_id " + project_id + "\n\n " + err, ProjectsService.name);
      throw new InternalServerErrorException("Can't delete a project with project_id " + project_id);
    };
  }
}
