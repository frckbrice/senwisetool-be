import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CompanyStatus, Prisma } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { RequirementPricePlanService } from '../requirement_price-plan/requirement_price-plan.service';
import { ReadFileWorkerHost } from './read-file-worker-host';
import { cwd } from 'node:process';
import { join } from 'path';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';


@Injectable()
export class RequirementService {
  private readonly logger = new LoggerService(RequirementService.name);
  private readonly currentDirectory = cwd() + '/src/global/utils/requirement-files/';
  private readonly targetDirectory = join(__dirname, '..', 'data', 'data.json');

  constructor(
    private prismaService: PrismaService,
    private readFileService: ReadFileWorkerHost,
  ) { }
  async create(createRequirementDto: Prisma.RequirementCreateInput) {
    // preve
    try {
      const requirementDto = await this.prismaService.requirement.create({
        data: createRequirementDto,
      });

      if (requirementDto)
        return {
          status: 201,
          data: requirementDto,
          message: 'Requirement created successfully',
        };
      else
        return {
          status: 400,
          data: null,
          message: 'Failed to create requirement',
        };
    } catch (error) {
      this.logger.error(
        `Failed to create requirement \n\n ${error}`,
        RequirementService.name,
      );
      throw new InternalServerErrorException(
        'Failed to create requirement requirement',
      );
    }
  }

  async update(
    id: string,
    createRequirementDto: Prisma.RequirementUpdateInput,
  ) {
    // preve
    try {
      const requirementDto = await this.prismaService.requirement.update({
        data: createRequirementDto,
        where: {
          id,
        },
      });

      if (requirementDto)
        return {
          status: HttpStatus.ACCEPTED,
          data: requirementDto,
          message: 'Requirement updated successfully',
        };
      else
        return {
          status: HttpStatus.NOT_MODIFIED,
          data: null,
          message: 'Failed to update requirement',
        };
    } catch (error) {
      this.logger.error(
        `Failed to update requirement \n\n ${error}`,
        RequirementService.name,
      );
      throw new InternalServerErrorException(
        'Failed to update requirement requirement',
      );
    }
  }

  // get all the requipemt
  async findAllRequirements() {
    try {
      const data = await this.prismaService.requirement.findMany({});

      if (data && data.length)
        return {
          status: HttpStatus.OK,
          data,
          message:
            'success fetching requirements for the corresponding price plan',
        };
      else
        return {
          status: HttpStatus.NOT_FOUND,
          data: [],
          message: 'No requirements for this price plan found',
        };
    } catch (error) {
      this.logger.error(
        `Error fetching requirements  \n\n ${error}`,
        RequirementService.name,
      );
      throw new HttpException('Error fetching comapnies', HttpStatus.NOT_FOUND);
    }
  }

  // async getAllFile({
  //   company_id }: { company_id: string }) {
  async getAllFile() {
    try {
      console.log("fetching all requirements")
      // get the current plan for the current company
      // const plan_id = await this.getPlanID({ company_id });

      // // get the corresponding plan name
      // const plan_name = await this.currentPlanIds.getPlanName({ plan_id: plan_id as string });

      // // check the corresponding plan name and return the corresponding requirements.

      // if (plan_name) {
      //   // read all files and copy them to the data folder
      //   const data = await this.readFileService.getRequirementsFromPlan(plan_name);
      //   return JSON.parse(data);
      // }
      const data = await this.readFileService.getRequirementsFromPlan("gold", this.currentDirectory);

      return JSON.parse(data);
    } catch (error) {
      this.logger.error(
        `Error fetching requirements for this plan  \n\n ${error}`,
        RequirementService.name,
      );
      throw new HttpException('Error fetching comapnies', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async getPlanID({ company_id }: { company_id: string }): Promise<string | null> {
    try {
      /* we need to verify if the company has subscribe first */
      const hasSubscribe = await this.prismaService.subscription.findFirst({
        where: {
          company_id: company_id,
          status: CompanyStatus.ACTIVE
        },
        select: {
          plan_id: true
        }
      });

      // throw if not subscribed
      if (!Boolean(hasSubscribe?.plan_id))
        throw new HttpException("Company has not subscribed on this plan", HttpStatus.FORBIDDEN);

      return <string>hasSubscribe?.plan_id;
    } catch (error) {
      this.logger.error(
        `Error fetching requirements for this plan  \n\n ${error}`,
        RequirementService.name,
      );
      throw new HttpException('Error fetching comapnies', HttpStatus.NOT_FOUND);
    }
  }

}

/**
 * TODO: use a worker thread for this operation: 
 * 1. create a worker service file
 * 2. listen to message frm the main thread
 * 3. read the file and write them to specified folder file
 * 4. return the address of file 
 */