import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectAssigneeDto } from './dto/create-project-assignee.dto';
import { UpdateProjectAssigneeDto } from './dto/update-project-assignee.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class ProjectAssigneeService {
  private logger = new LoggerService(ProjectAssigneeService.name)
  constructor(private prismaService: PrismaService) { }
  async create(createProjectAssigneeDto: Prisma.AssigneeCreateInput) {

    try {
      const data = await this.prismaService.assignee.create({
        data: createProjectAssigneeDto
      });
      if (typeof data != 'undefined')
        return {
          data,
          message: "Project Assigned to this user created successfully",
          status: 201
        }
      return {
        data: null,
        message: "Failed to assign projects to this user",
        status: 400
      }
    } catch (error) {
      this.logger.error(`Failed to assign projects to this user \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to updated project codes to this user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(project_id?: string) {
    let options = {}
    // we need all the assignees for this project
    if (project_id)
      options = {
        projectCodes: {
          has: project_id
        }
      }

    try {
      const data = await this.prismaService.assignee.findMany({
        where: options
      });
      if (typeof data != 'undefined' && data.length)
        return {
          data: data.map((a) => {
            return { agentCode: a.agentCode, projectCodes: a.projectCodes, fullName: a.fullName };
          }),
          message: "sucessfully fetched project codes assigned to this user",
          status: 200
        }
      return {
        data: null,
        message: "Failed to fetch assigned project codes for this user code",
        status: 400
      }
    } catch (error) {
      this.logger.error(`Failed to fetch assigned project codes for this user \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to fetch assigned  project codes to this user', HttpStatus.NOT_FOUND);
    }
  }

  // get all project codes for this agent
  async findOne(id: string) {

    // in case the code is provide instead
    let options = Object.create({});

    if (id.length <= 5)
      options['agentCode'] = id
    else
      options['id'] = id
    try {
      const data = await this.prismaService.assignee.findUnique({
        where: options
      });
      if (typeof data != 'undefined')
        return {
          data: data?.projectCodes,
          message: "sucessfully fetched project codes assigned to this user",
          status: 201
        }
      return {
        data: null,
        message: "Failed to fetch assigned project codes for this user code",
        status: 400
      }
    } catch (error) {
      this.logger.error(`Failed to fetch assigned project codes for this user \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to fetch assigned  project codes to this user', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, updateProjectAssigneeDto: Prisma.AssigneeUpdateInput) {
    let options = Object.create({});
    // in case the code is provide instead
    if (id.length <= 5)
      options['agentCode'] = id
    else
      options['id'] = id


    try {
      const data = await this.prismaService.assignee.update({
        where: options,
        data: updateProjectAssigneeDto
      })
      if (typeof data != 'undefined')
        return {
          data: data,
          message: "sucessfully updated project codes assigned to this user",
          status: 204
        }
      return {
        data: null,
        message: "Failed to updated assigned project codes for this user code",
        status: 400
      }
    } catch (error) {
      this.logger.error(`Failed to updated assigned project codes for this user \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to updated project codes to this user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(code: string) {
    try {
      const data = await this.prismaService.assignee.delete({
        where: { agentCode: code },
      })
      if (typeof data != 'undefined')
        return {
          data: data,
          message: "sucessfully Deleted project codes assigned to this user",
          status: 204
        }
      return {
        data: null,
        message: "Failed to Deleted assigned project codes for this user code",
        status: 400
      }
    } catch (error) {
      this.logger.error(`Failed to Deleted assigned project codes for this user \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to Deleted project codes to this user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
