import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';
import { CurrentPlanIds } from 'src/global/plan-id/current-plan-ids';

@Injectable()
export class PricesService {

  private logger = new LoggerService(PricesService.name)
  constructor(
    private readonly prismaService: PrismaService,
    private readonly currenPlanIds: CurrentPlanIds
  ) { }


  async create(createPriceDto: Prisma.Price_planCreateInput) {

    // validate plan id
    if (!this.currenPlanIds.PLAN_ID.includes(createPriceDto.id)) {
      throw new Error(`plan id ${createPriceDto.id} not found`)
    }

    try {
      const result = await this.prismaService.price_plan.create({
        data: createPriceDto
      });

      if (result)
        return {
          status: 201,
          data: result,
          message: 'Price plan created successfully'
        }
      else
        return {
          status: 500,
          data: null,
          message: 'Failed to create price plan'
        }
    } catch (e) {
      console.error(`\n\nError while creating price plan ${e}`);
      this.logger.error(`Error while creating price plan ${e}`, PricesService.name);
      throw new InternalServerErrorException("Failed to create price plan");
    }

  }

  async findAll() {
    try {
      const resutls = await this.prismaService.price_plan.findMany({});

      if (resutls.length > 0)
        return {
          status: 200,
          data: resutls,
          message: 'Price plans fetched successfully'
        }
      else
        return {
          status: 404,
          data: null,
          message: 'Failed to fetch price plans'
        }
    } catch (error) {
      console.error(`\n\nError while fetching price plans: \n\n  ${error}`);
      this.logger.error(`Error while fetching price plans: \n\n  ${error}`, PricesService.name);
      throw new NotFoundException("Failed to fetch price plans");
    }
  }

  async findOne(plan_id: string) {

    // validate plan id
    if (!this.currenPlanIds.PLAN_ID.includes(plan_id)) {
      throw new Error(`plan id ${plan_id} not found`)
    }

    try {
      const resutls = await this.prismaService.price_plan.findUnique({
        where: {
          id: plan_id,
        },
        select: {
          id: true,
          product_name: true,
        }
      });

      if (resutls && resutls.id)
        return {
          status: 200,
          data: resutls,
          message: 'Price plan fetched successfully'
        }
      else
        return {
          status: 404,
          data: null,
          message: 'Failed to fetch price plan'
        }
    } catch (error) {
      console.error(`\n\nError while fetching price plan: \n\n  ${error}`);
      this.logger.error(`Error while fetching price plan: \n\n  ${error}`, PricesService.name);
      throw new NotFoundException(" Failed to fetch price plan");
    }
  }

  update(id: number, updatePriceDto: UpdatePriceDto) {
    return `This action updates a #${id} price`;
  }

  remove(id: number) {
    return `This action removes a #${id} price`;
  }
}
