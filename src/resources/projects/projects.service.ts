import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, ProjectStatus, TypeProject } from '@prisma/client';
import { PaginationProjectQueryDto } from './dto/paginate-project.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { generateMapping, getUUIDFromCode } from './create-code-project-mapping';
import { ProjectAssigneeService } from '../project-assignee/project-assignee.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new LoggerService(ProjectsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private slugify: Slugify,
    private projectAssigneeService: ProjectAssigneeService
  ) { }


  async create({
    createProjectDto,
    user_id,
  }: {
    createProjectDto: Prisma.ProjectCreateInput;
    user_id: string;
  }) {
    // avoid creating the same project twice

    const project = await this.prismaService.project.findFirst({
      where: {
        slug: this.slugify.slugify(createProjectDto.title),
      },
    });

    if (project)
      return {
        data: project,
        status: HttpStatus.CONFLICT,
        message: `Project  ${createProjectDto.title} already exists`,
      };

    // validate date so that end date should be greater than start date
    console.log(createProjectDto.Company)
    if (createProjectDto.start_date > createProjectDto.end_date)
      return {
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `End date should be greater than or equal to start date`,
      };




    try {
      /**
   * 1. create mapping with created uuid
   * 2. persist this mapping in the DB for later retrieval 
   */
      const { uuid, code: projectCode } = generateMapping(crypto.randomUUID());
      await this.projectAssigneeService.create({
        agentCode: projectCode,
        projectCodes: [uuid],
        Company: {
          create: undefined,
          connectOrCreate: undefined,
          connect: undefined
        }
      })


      const result = await this.prismaService.$transaction(async (tx) => {
        const result = await tx.project.create({
          data: {
            ...createProjectDto,
            slug: this.slugify.slugify(createProjectDto.title),
            code: uuid,
            deployed_at: "1970-01-01T00:00:00+01:00",
            archived_at: "1970-01-01T00:00:00+01:00",
            deleted_at: "1970-01-01T00:00:00+01:00",
            updated_at: "1970-01-01T00:00:00+01:00",
          },
        });

        // set the project audit to know who is in charge of the project
        // await tx.project_audit.create({
        //   data: {
        //     project_id: result.id,
        //     user_id: user_id,
        //     type_of_project: result.type,
        //     action: createProjectDto.status
        //   },
        // });

        return result;
      });

      if (result) {

        return {
          data: { ...result, code: projectCode },
          status: 201,
          message: `project created successfully`,
        };
      }

      else
        return {
          data: null,
          status: 400,
          message: `Failed to create project`,
        };
    } catch (error) {
      this.logger.error(
        `Error while creating project ${error}`,
        ProjectsService.name,
      );
      throw new InternalServerErrorException(`Error while creating project`);
    }
  }

  async findAll(query: Partial<PaginationProjectQueryDto> | any, company_id: string) {

    const { status, type, page, perPage, search, campaign_id, } = query;
    const where = Object.create({ company_id });
    let Query = Object.create({ where });

    if (status) {
      where['status'] = status;
    }

    if (type) {
      where['type'] = type;
    }

    if (campaign_id) {
      where['campaign_id'] = campaign_id;
    }

    if (search)
      where["search"] = search

    if (search)
      where["search"] = search


    // if we have assigned a query to the uri, we just return the corresponding function.
    if (query.agentCode)
      return this.getAllAssignedProjects(query.agentCode, company_id);


    Query = {
      ...Query,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        start_date: 'desc',
      },
    };
    // find all the project with the latest start date with its status and type
    try {
      const [total, projects] = await this.prismaService.$transaction([
        this.prismaService.project.count(),
        this.prismaService.project.findMany(Query),
      ]);
      if (projects.length)
        return {
          status: 200,
          message: 'projects fetched successfully',
          data: projects,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: 404,
          message: 'No projects found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error('Error fetching projects', ProjectsService.name);
      throw new NotFoundException('Error fetching projects');
    }
  }

  async findOne(project_id: string) {
    const where = {} as {
      id: string | undefined;
      slug: string | undefined;
    };
    if (project_id.toString().includes('-')) {
      where['slug'] = project_id;
    } else {
      where['id'] = project_id;
    }



    try {
      const result = await this.prismaService.project.findUnique({
        where,
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `project fetched successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch project`,
        };
    } catch (err) {
      this.logger.error(
        `Can't find a project with project_id ${project_id} \n\n ${err}`,
        ProjectsService.name,
      );
      throw new NotFoundException(
        "Can't find a project with project_id " + project_id,
      );
    }
  }

  async findOneProjectFromPhone(project_code: string) {

    // match the code with the corresponding uuid saved for this project
    const retrievedUUID = getUUIDFromCode(project_code);

    if (typeof retrievedUUID == 'undefined')
      throw new HttpException(`No matching project code for this code`, HttpStatus.BAD_REQUEST)

    try {
      const result = await this.prismaService.project.findUnique({
        where: {
          code: <string>retrievedUUID,
          status: ProjectStatus.DEPLOYED,
          // type: <TypeProject>(type === 'training' ? type : "") // this isn't possible
        },
        select: {
          id: true,
          title: true,
          status: true,
          start_date: true,
          end_date: true,
          project_structure: true,
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `project fetched successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch project`,
        };
    } catch (err) {
      this.logger.error(
        `Can't find a project with project_code ${project_code} \n\n ${err}`,
        ProjectsService.name,
      );
      throw new NotFoundException(
        "Can't find a project with project_code " + project_code,
      );
    }
  }

  // find all the ass

  async update({
    id,
    user_id,
    updateProjectDto,
  }: {
    id: string;
    user_id: string;
    updateProjectDto: Prisma.ProjectUpdateInput;
  }) {

    // check if the project exists first
    const existingProject = await this.findOne(id);
    if (typeof existingProject == 'undefined')
      return {
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `No project with this ID`,
      };

    console.log("the existing project dto: ", existingProject)
    console.log("the updated  project dto\n\n: ", updateProjectDto)
    // check the type of action and set the corresponding date
    if (updateProjectDto.hasOwnProperty('status')) {
      if (updateProjectDto.status === ProjectStatus.ARCHIVED) {
        updateProjectDto.archived_at = new Date().toISOString();
        updateProjectDto.deployed_at = existingProject.data?.deployed_at;
        updateProjectDto.draft_at = existingProject.data?.draft_at;
        updateProjectDto.deleted_at = existingProject.data?.deleted_at;

      }
      // if (updateProjectDto.status === ProjectStatus.DRAFT) {
      //   updateProjectDto.archived_at = existingProject.data?.archived_at;
      //   updateProjectDto.deployed_at = existingProject.data?.deployed_at;
      //   updateProjectDto.draft_at = new Date().toISOString();
      //   updateProjectDto.deleted_at = existingProject.data?.deleted_at;

      // }
      if (updateProjectDto.status === ProjectStatus.DEPLOYED) {
        updateProjectDto.deployed_at = new Date().toISOString();
        updateProjectDto.archived_at = existingProject.data?.archived_at;
        updateProjectDto.draft_at = existingProject.data?.draft_at;
        updateProjectDto.deleted_at = existingProject.data?.deleted_at;
      }
      if (updateProjectDto.status === ProjectStatus.DELETED) {
        updateProjectDto.deployed_at = existingProject.data?.deployed_at;
        updateProjectDto.archived_at = existingProject.data?.archived_at;
        updateProjectDto.draft_at = existingProject.data?.draft_at;
        updateProjectDto.deleted_at = new Date().toISOString();
      }
    }

    console.log("updated dto:\n\n ", updateProjectDto)
    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const result = await this.prismaService.project.update({
          data: updateProjectDto,
          where: {
            id,
          },
        });
        console.log("projectId : ", result.id, "userId: ", user_id)
        // set the project audit to keep track of who did this action
        // await tx.project_audit.create({
        //   where: {
        //     project_id: result.id,
        //     user_id: user_id,
        //   },
        //   data: {
        //     type_of_project: <TypeProject>result.type,
        //     action: <ProjectStatus>result.status
        //   },
        // });

        return result;
      });

      if (result)
        return {
          data: result,
          status: HttpStatus.OK, // the resource is return to be used by the client
          message: `project updated successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to update project`,
        };
    } catch (err) {
      this.logger.error(
        `Can't update a project with id  ${id} \n\n ${err}`,
        ProjectsService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a project with id " + id,
      );
    }
  }
  // update many projects
  async updateMany(projectIds: string[], updateProjectDto: Prisma.ProjectUpdateInput, user_id: string) {

    try {
      const updatedProjects = await this.prismaService.$transaction(async (tx) => {
        // update only existing prejects
        const updatedProjects = Promise.all(projectIds.map(async (project_id) => {
          const existingProject = await this.findOne(project_id);

          if (typeof existingProject != 'undefined')
            return await this.update({
              id: <string>existingProject.data?.id,
              user_id,
              updateProjectDto
            })
        }));
        return updatedProjects;
      })

      if (updatedProjects.length)
        return {
          data: updatedProjects,
          status: HttpStatus.OK, // the resource is return to be used by the client
          message: `project archive successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to archive project`,
        };
    } catch (error) {
      this.logger.error(
        `Can't archieve a project list \n\n ${error}`,
        ProjectsService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a project list ",
      );
    }
  }

  // update a single project

  async deleteManyByIds(ids: string[], user_id: string) {
    try {
      const result = await this.prismaService.$transaction(async (tx) => {

        const updatedProjects = Promise.all(ids.map(async (project_id) => {
          const existingProject = await this.findOne(project_id);

          if (typeof existingProject != 'undefined')
            return await this.remove(<string>existingProject.data?.id, user_id)
        }))
        return updatedProjects;
      })

      if (result)
        return {
          data: null,
          status: HttpStatus.NO_CONTENT,
          message: `project list deleted successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to delete project list`,
        };
    } catch (error) {
      this.logger.error(
        "Can't delete a project list with project_ids " + '\n\n ' + error,
        ProjectsService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a project list with project_ids ",
      );
    }
  }

  // delete a single project
  async remove(project_id: string, user_id: string) {

    // check if the project exists first
    const existingProject = await this.findOne(project_id);
    if (typeof existingProject == 'undefined')
      return {
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `No project with this ID`,
      };

    try {
      const result = await this.prismaService.project.delete({
        where: {
          id: project_id,
          deleted_at: new Date().toISOString()
        }
      });
      // const result = await this.prismaService.$transaction(async (tx) => {
      //   const result = await this.prismaService.project.delete({
      //     where: {
      //       id: project_id,
      //     }
      //   });

      //   // set who deleted the project
      //   // await tx.project_audit.delete({
      //   //   where: {
      //   //     id: result.id,
      //   //     user_id: user_id,
      //   //   },
      //   // });

      //   return result;
      // })

      if (result)
        return {
          data: null,
          status: HttpStatus.NO_CONTENT,
          message: `project deleted successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to delete project`,
        };
    } catch (err) {
      this.logger.error(
        "Can't delete a project with project_id " + project_id + '\n\n ' + err,
        ProjectsService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a project with project_id " + project_id,
      );
    }
  }

  // get all the projects assigned to an agent
  async getAllAssignedProjects(agentCode: string, company_id?: string) {
    try {
      // get list of projects codes assigned to this agent
      const listOfCodes = (await this.projectAssigneeService.findOne(agentCode))?.data;
      if (listOfCodes?.length) {

        const listOfUuids = await this.projectAssigneeService.getAllTheUuidsFromTheCodesList(listOfCodes)

        const projects = await this.prismaService.project.findMany({
          where: {
            code: {
              in: [...listOfUuids!]
            },
            status: ProjectStatus.DEPLOYED,
            company_id
          },
          select: {
            status: true,
            type: true,
            id: true,
            title: true
          },
        });
        if (typeof projects != 'undefined' && projects.length)
          return {
            data: projects,
            status: HttpStatus.OK,
            message: "sucessfully fetched projects assigned to this agent",
          }
        return {
          data: [],
          status: HttpStatus.BAD_REQUEST,
          message: "Failed to fetch projects assigned to this agent",
        }

      } else return {
        data: [],
        status: HttpStatus.BAD_REQUEST,
        message: "This code has No projects assigned to.",
      }

    } catch (err) {
      this.logger.error(`Failed to fetch projects assigned to this agent \n\n ${err}`, ProjectsService.name);
      throw new HttpException('Failed to fetch projects assigned to this agent', HttpStatus.NOT_FOUND);
    }
  }

}
