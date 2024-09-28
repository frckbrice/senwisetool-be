import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Prisma, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';
import { CurrentPlanIds } from 'src/global/utils/current-plan-ids';
// import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class PricesService {
  private logger = new LoggerService(PricesService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly currenPlanIds: CurrentPlanIds,
    // private readonly subscriptionService: SubscriptionsService
  ) { }

  async create(createPriceDto: Prisma.Price_planCreateInput) {
    // validate plan id
    if (
      !this.currenPlanIds.PLAN_ID.some(
        (value) => value.id === createPriceDto.id,
      )
    ) {
      throw new Error(`plan id ${createPriceDto.id} not found`);
    }

    try {
      const result = await this.prismaService.price_plan.create({
        data: createPriceDto,
      });

      if (result)
        return {
          status: 201,
          data: result,
          message: 'Price plan created successfully',
        };
      else
        return {
          status: 500,
          data: null,
          message: 'Failed to create price plan',
        };
    } catch (e) {
      console.error(`\n\nError while creating price plan ${e}`);
      this.logger.error(
        `Error while creating price plan ${e}`,
        PricesService.name,
      );
      throw new InternalServerErrorException('Failed to create price plan');
    }
  }

  async findAll() {
    try {
      const resutls = await this.prismaService.price_plan.findMany({});

      if (resutls.length > 0)
        return {
          status: 200,
          data: resutls,
          message: 'Price plans fetched successfully',
        };
      else
        return {
          status: 404,
          data: null,
          message: 'Failed to fetch price plans',
        };
    } catch (error) {
      console.error(`\n\nError while fetching price plans: \n\n  ${error}`);
      this.logger.error(
        `Error while fetching price plans: \n\n  ${error}`,
        PricesService.name,
      );
      throw new NotFoundException('Failed to fetch price plans');
    }
  }

  async findOne(plan_name: string) {
    // validate plan id
    if (!this.currenPlanIds.PLAN_ID.some((value) => value.name === plan_name)) {
      throw new Error(`plan  ${plan_name} not found`);
    }

    try {
      const resutl = await this.prismaService.price_plan.findUnique({
        where: {
          plan_name: plan_name,
        },
        select: {
          id: true,
          product_name: true,
        },
      });
      if (resutl && resutl.id)
        return {
          status: 200,
          data: resutl,
          message: 'Price plan fetched successfully',
        };
      else
        return {
          status: 404,
          data: null,
          message: 'Failed to fetch price plan',
        };
    } catch (error) {
      console.error(`\n\nError while fetching price plan: \n\n  ${error}`);
      this.logger.error(
        `Error while fetching price plan: \n\n  ${error}`,
        PricesService.name,
      );
      throw new NotFoundException(' Failed to fetch price plan');
    }
  }

  async findCurrentcompanyPlan(company_id: string) {

    // get current company subscrition
    // const currentCompanySubscription = await this.subscriptionService.getLastValidSubscription(company_id)

    try {
      /*
        this design (line 139-149) is not legal as it is not following SRP from SOLID method. 
        but it's a technical debt that will be updated later. for now we can go with it since 
        it is solving current issue of dependencies ...
      */
      const currentCompanySubscription = await this.prismaService.subscription.findFirst({
        where: {
          AND: [
            { company_id, },
            { status: SubscriptionStatus.ACTIVE },
          ]
        },
        select: {
          plan_id: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (typeof currentCompanySubscription == 'undefined')
        throw new HttpException(`Company has not subscribed on this plan`, HttpStatus.FORBIDDEN);

      const resutl = await this.prismaService.price_plan.findUnique({
        where: {
          id: currentCompanySubscription?.plan_id
        },
        select: {
          id: true,
          product_name: true,
        },
      });

      console.log("current pice plan:", resutl);
      if (resutl && resutl.id)
        return {
          status: 200,
          data: resutl,
          message: 'CurrentPrice plan fetched successfully',
        };
      else
        return {
          status: 404,
          data: null,
          message: 'Failed to fetch current price plan',
        };
    } catch (error) {
      console.error(`\n\nError while fetching current price plan : \n\n  ${error}`);
      this.logger.error(
        `Error while fetching current price plan: \n\n  ${error}`,
        PricesService.name,
      );
      throw new NotFoundException(' Failed to fetch price plan');
    }
  }



  update(id: number, updatePriceDto: UpdatePriceDto) {
    return `This action updates a #${id} price`;
  }

  remove(id: number) {
    return `This action removes a #${id} price`;
  }
}
