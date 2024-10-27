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


    if (!createProjectAssigneeDto?.agentCode)
      return {
        status: 400,
        message: "INVALID CREDENTIALS",
        data: null
      }
    try {
      console.log("project assignee from servce => ", createProjectAssigneeDto)
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

  async getAllAssigneeFromThisProject(code?: string) {
    let options = {}

    /*
     * we need all the assignees involved in this project code. 
     * ie all the project assigned to this code
     * since sometimes assignee agencode is a project code
     */

    if (code)
      options = {
        projectCodes: {
          has: code
        }
      }

    try {
      const data = await this.prismaService.assignee.findMany({
        where: options
      });
      if (typeof data != 'undefined' && data.length)
        return {
          data: data?.map((a) => a.agentCode),
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

  /**
   * some assignees have as agentCode the project code. so we need to recover 
   * all the their uuid which are strings in their corresponding projectCode.
   * see this   const { uuid, code: projectCode } = generateMapping(crypto.randomUUID());
      await this.projectAssigneeService.create({
        agentCode: projectCode,
        projectCodes: [uuid]
      })
   */
  async getAllTheUuidsFromTheCodesList(projectCodes: string[]) {
    try {

      // need all assignees that has agentCode as projectCode. 
      // then retrieve its uuid since their projectCodes is of length 1.
      const assignees = await this.prismaService.assignee.findMany({
        where: {
          agentCode: {
            in: [...projectCodes]
          }
        },
        select: {
          projectCodes: true
        }
      })

      if (assignees?.flat(1).length) { // if they exist
        return assignees?.map(a => a?.projectCodes[0])
      }
      else return [];
    } catch (error) {
      this.logger.error(`Failed to fetch assigned project codes UUIDs \n\n ${error}`, ProjectAssigneeService.name);
      throw new HttpException('Failed to fetch assigned  project codes UUIDs', HttpStatus.NOT_FOUND);
    }
  }

  // find all the project of one assigne having this agent code.
  async findAll(company_id: string, agentCode?: string,) {
    let options = {}
    // we need all the projects code assigned to this agent code

    if (!agentCode) return {
      data: [],
      message: "Please provide an agent code",
      status: 400
    }

    try {
      // retrieve first the uuid corresponding to this code
      const data = await this.prismaService.assignee.findUnique({
        where: {
          agentCode: agentCode ?? "",
          company_id
        },
        select: {
          projectCodes: true,
        }
      })


      if (typeof data != 'undefined' && data?.projectCodes.length)
        return {
          data: data?.projectCodes,
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

  // find 
  async findAllSubAccounts(company_id: string) {

    try {
      console.log('company_id\n', company_id)

      const data = await this.prismaService.assignee.findMany({
        
        where: {
          company_id
        }
      })
      if (data)
        return {
          data: data,
          message: "Successfully fetch all su accounts",
          status: 200
        }
      return {
        data: null,
        message: "Failed fetching subaccounts",
        status: 400
      }
    } catch (error) {
      console.log(error)
      this.logger.error(`Failed to fetch all sub accounts for this company\n\n ${error}`, ProjectAssigneeService.name)
      throw new HttpException('failed to fetch all sub accounts for this company', HttpStatus.NOT_FOUND)

    }
  }

  async getAllTheAssigneesCodesFromAListOfProjectUuidsOfACompany(projectUuids: string[], company_id: string) {

    try {

      /**
        the objective here is to get all the assignees based of their uuids
        this is to be return on each project, market, GET request.
       * 
       */

      const assignees = await this.prismaService.assignee.findMany({
        where: {
          projectCodes: {
            hasSome: projectUuids,
          },
          company_id,
        },
        select: {
          agentCode: true,
          projectCodes: true
        }
      });
      if (assignees)
        return {
          data: assignees,
          message: "Successfully fetch all su accounts",
          status: 200
        }
      return {
        data: null,
        message: "Failed fetching subaccounts",
        status: 400
      }
    } catch (error) {
      console.log(error)
      this.logger.error(`Failed to fetch  all sub accounts for this company\n\n ${error}`, ProjectAssigneeService.name)
      throw new HttpException('failed to fetch all sub accounts for this company', HttpStatus.NOT_FOUND)

    }
  }



  // get all project codes for this agent
  async findOne(id: string, company_id?: string) {

    console.log("inside projet assignee, incoming ID: ", id);
    // in case the code is provide instead 
    let options = Object.create({});

    if (id.length <= 5)
      options['agentCode'] = id
    else
      options['id'] = id
    options['company_id'] = company_id;
    console.log("inside project assignee , option: ", options)
    try {
      const data = await this.prismaService.assignee.findUnique({
        where: options
      });

      console.log("inside project assignee , data: ", data)
      if (typeof data != 'undefined')
        return {
          data: data?.projectCodes,
          message: "sucessfully fetched project codes assigned to this user",
          status: 201
        }
      return {
        data: [],
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
