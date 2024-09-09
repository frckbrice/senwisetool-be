import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { RequirementPricePlanService } from '../requirement_price-plan/requirement_price-plan.service';

@Injectable()
export class RequirementService {
  private readonly logger = new LoggerService(RequirementService.name);

  constructor(
    private prismaService: PrismaService,
    private requiredPricePlans: RequirementPricePlanService
  ) { }
  async create(createRequirementDto: Prisma.RequirementCreateInput) {

    // preve
    try {
      const requirementDto = await this.prismaService.requirement.create({
        data: createRequirementDto
      });

      if (requirementDto)
        return {
          status: 201,
          data: requirementDto,
          message: "Requirement created successfully"
        }
      else
        return {
          status: 400,
          data: null,
          message: "Failed to create requirement"
        }
    } catch (error) {
      this.logger.error(`Failed to create requirement \n\n ${error}`, RequirementService.name);
      throw new InternalServerErrorException("Failed to create requirement requirement");
    }
  }

  async update(id: string, createRequirementDto: Prisma.RequirementUpdateInput) {

    // preve
    try {
      const requirementDto = await this.prismaService.requirement.update({
        data: createRequirementDto,
        where: {
          id
        }
      });

      if (requirementDto)
        return {
          status: HttpStatus.ACCEPTED,
          data: requirementDto,
          message: "Requirement updated successfully"
        }
      else
        return {
          status: HttpStatus.NOT_MODIFIED,
          data: null,
          message: "Failed to update requirement"
        }
    } catch (error) {
      this.logger.error(`Failed to update requirement \n\n ${error}`, RequirementService.name);
      throw new InternalServerErrorException("Failed to update requirement requirement");
    }
  }

  // get all the requipemt
  async findAllRequirements(params: { plan_id?: string, company_id?: string }) {
    // TODO: make this function follow the SOLID princple of SRP


    try {
      /* check if there is a need of all or some of the requirements */
      const { plan_id } = params;
      // Object.create() isn't supported in some legacy browsers
      const where = {} as { price_plan_id: string | undefined }
      if (plan_id)
        where['price_plan_id'] = plan_id ?? "";

      // we need to verify if the company has subscribe first
      const hasSubscribe = this.prismaService.subscription.findFirst({
        where: {
          company_id: params.company_id,
          status: 'ACTIVE'
        }
      });

      if (!Boolean(hasSubscribe))
        throw new HttpException("Company has not subscribed", HttpStatus.FORBIDDEN);

      // if there is no plan_id, then return all the requirements for the company

      /** get all the corresponding requirements IDs for the price plan*/
      const allReqIds = (await this.requiredPricePlans.findAllRequirements(where));
      // filter only the requirment Ids
      const reqIds = allReqIds.data.map((req) => req.req_id);  // just for the sake of performace

      //filter the request
      const data = await this.prismaService.requirement.findMany({
        where: {
          id: { in: reqIds }
        }
      });

      if (data && data.length)
        return {
          status: HttpStatus.OK,
          data,
          message: "success fetching requirements for the corresponding price plan"
        }
      else
        return {
          status: HttpStatus.NOT_FOUND,
          data: [],
          message: "No requirements for this price plan found"
        }
    } catch (error) {
      this.logger.error(`Error fetching requirements for this plan id: ${params.plan_id} \n\n ${error}`, RequirementService.name);
      throw new HttpException("Error fetching comapnies", HttpStatus.NOT_FOUND);
    }
  }

}
